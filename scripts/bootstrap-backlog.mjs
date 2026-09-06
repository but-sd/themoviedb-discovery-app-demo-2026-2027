#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import yaml from "js-yaml";

const root = new URL("..", import.meta.url);
const backlog = yaml.load(readFileSync(new URL("../.github/backlog.yml", import.meta.url), "utf8"));
const labelsConfig = yaml.load(readFileSync(new URL("../.github/labels.yml", import.meta.url), "utf8"));
const projectViews = normalizeProjectViews(backlog.project);

if (process.argv.includes("--dry-run")) {
  console.log(`Project: ${backlog.project.title}`);
  console.log(`Views: ${projectViews.map((view) => view.name).join(", ")}`);
  console.log(`Fields: ${(backlog.project.fields ?? []).map((field) => field.name).join(", ")}`);
  console.log(`Labels: ${(labelsConfig.labels ?? []).length}`);
  console.log(`Milestones: ${(backlog.milestones ?? []).length}`);
  console.log(`Tickets: ${(backlog.tickets ?? []).length}`);
  process.exit(0);
}

const repo = getArg("--repo") ?? detectRepo();
const projectOwnerArg = getArg("--project-owner");
const [owner, name] = repo.split("/");

if (!owner || !name) {
  throw new Error(`Invalid repository "${repo}". Expected "owner/name".`);
}

const repository = graphql(
  `
    query Repository($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        id
        owner {
          id
          login
          __typename
        }
      }
    }
  `,
  { owner, name },
).repository;
const projectOwner = getProjectOwner(projectOwnerArg, repository.owner);

console.log(`Bootstrapping backlog in ${repo}`);
console.log(`Project owner: ${projectOwner.login}`);

syncLabels(labelsConfig.labels ?? []);
const milestones = syncMilestones(backlog.milestones ?? []);
const existingIssues = listIssues();
const project = ensureProject(projectOwner, backlog.project.title);
const projectFields = syncProjectFields(projectOwner, project.number, project.id, backlog.project.fields ?? []);
syncProjectViews(projectOwner, project.number, project.id, projectViews, projectFields);

for (const ticket of backlog.tickets ?? []) {
  const issue = ensureIssue(ticket, milestones, existingIssues);
  const item = addIssueToProject(project.id, issue.node_id);
  setProjectStatus(project.id, item.id, projectFields, backlog.project.status);
  setTicketWeight(project.id, item.id, projectFields, ticket.weight);
}

console.log(`Backlog ready: https://github.com/${repo}/issues`);
console.log(`Project ready: ${projectUrl(projectOwner, project.number)}`);

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function normalizeProjectViews(projectConfig) {
  if (Array.isArray(projectConfig.views) && projectConfig.views.length > 0) {
    return projectConfig.views;
  }

  if (projectConfig.view) {
    return [{ name: projectConfig.view, layout: "board" }];
  }

  return [];
}

function detectRepo() {
  const remote = execFileSync("git", ["remote", "get-url", "origin"], { cwd: root, encoding: "utf8" }).trim();
  const match = remote.match(/github\.com[:/](?<repo>[^/]+\/[^/.]+)(?:\.git)?$/u);
  if (!match?.groups?.repo) {
    throw new Error('Unable to detect GitHub repository. Pass it explicitly with "--repo owner/name".');
  }
  return match.groups.repo;
}

function gh(args, options = {}) {
  const output = execFileSync("gh", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });
  return output.trim();
}

function ghJson(args, options) {
  const output = gh(args, options);
  return output ? JSON.parse(output) : null;
}

function graphql(query, variables = {}) {
  const args = ["api", "graphql", "-f", `query=${query}`];
  for (const [key, value] of Object.entries(variables)) {
    args.push(typeof value === "number" ? "-F" : "-f", `${key}=${value}`);
  }
  const response = ghJson(args);
  return response.data;
}

function syncLabels(labels) {
  for (const label of labels) {
    const args = [
      "api",
      `repos/${repo}/labels/${encodeURIComponent(label.name)}`,
      "--method",
      "PATCH",
      "-f",
      `new_name=${label.name}`,
      "-f",
      `color=${label.color}`,
      "-f",
      `description=${label.description ?? ""}`,
    ];

    try {
      gh(args);
    } catch {
      gh([
        "api",
        `repos/${repo}/labels`,
        "--method",
        "POST",
        "-f",
        `name=${label.name}`,
        "-f",
        `color=${label.color}`,
        "-f",
        `description=${label.description ?? ""}`,
      ]);
    }
  }
}

function syncMilestones(milestones) {
  const existing = ghJson(["api", `repos/${repo}/milestones?state=all&per_page=100`]);
  const byTitle = new Map(existing.map((milestone) => [milestone.title, milestone]));

  for (const milestone of milestones) {
    const current = byTitle.get(milestone.title);
    if (current) {
      const updated = ghJson([
        "api",
        `repos/${repo}/milestones/${current.number}`,
        "--method",
        "PATCH",
        "-f",
        `title=${milestone.title}`,
        "-f",
        `description=${milestone.description ?? ""}`,
        "-f",
        "state=open",
      ]);
      byTitle.set(milestone.title, updated);
    } else {
      const created = ghJson([
        "api",
        `repos/${repo}/milestones`,
        "--method",
        "POST",
        "-f",
        `title=${milestone.title}`,
        "-f",
        `description=${milestone.description ?? ""}`,
      ]);
      byTitle.set(milestone.title, created);
    }
  }

  return byTitle;
}

function listIssues() {
  const issues = ghJson(["api", `repos/${repo}/issues?state=all&per_page=100`]);
  return new Map(
    issues
      .filter((issue) => !issue.pull_request)
      .map((issue) => {
        const id = issue.body?.match(/<!-- backlog-id: (?<id>[-\w]+) -->/u)?.groups?.id;
        return id ? [id, issue] : undefined;
      })
      .filter(Boolean),
  );
}

function ensureIssue(ticket, milestones, existingIssues) {
  const body = `${ticket.body.trim()}\n\n<!-- backlog-id: ${ticket.id} -->\n`;
  const milestone = ticket.milestone ? milestones.get(ticket.milestone) : undefined;
  const args = [
    "api",
    existingIssues.has(ticket.id)
      ? `repos/${repo}/issues/${existingIssues.get(ticket.id).number}`
      : `repos/${repo}/issues`,
    "--method",
    existingIssues.has(ticket.id) ? "PATCH" : "POST",
    "-f",
    `title=${ticket.title}`,
    "-f",
    `body=${body}`,
    "-f",
    "state=open",
  ];

  for (const label of ticket.labels ?? []) {
    args.push("-f", `labels[]=${label}`);
  }

  if (milestone) {
    args.push("-F", `milestone=${milestone.number}`);
  }

  const issue = ghJson(args);
  existingIssues.set(ticket.id, issue);
  return issue;
}

function ensureProject(ownerInfo, title) {
  const projects = listProjects(ownerInfo);
  const existing = projects.find((candidate) => candidate.title === title);
  if (existing) {
    return existing;
  }

  return graphql(
    `
      mutation CreateProject($ownerId: ID!, $title: String!) {
        createProjectV2(input: { ownerId: $ownerId, title: $title }) {
          projectV2 {
            id
            number
            title
          }
        }
      }
    `,
    { ownerId: ownerInfo.id, title },
  ).createProjectV2.projectV2;
}

function getProjectOwner(projectOwner, defaultOwner) {
  if (!projectOwner) {
    return defaultOwner;
  }

  if (projectOwner === "@me") {
    return graphql(`
      query Viewer {
        viewer {
          id
          login
          __typename
        }
      }
    `).viewer;
  }

  const result = graphql(
    `
      query ProjectOwner($login: String!) {
        user(login: $login) {
          id
          login
          __typename
        }
        organization(login: $login) {
          id
          login
          __typename
        }
      }
    `,
    { login: projectOwner },
  );

  const ownerInfo = result.user ?? result.organization;
  if (!ownerInfo) {
    throw new Error(`Project owner "${projectOwner}" was not found.`);
  }

  return ownerInfo;
}

function syncProjectFields(ownerInfo, projectNumber, projectId, desiredFields) {
  let projectFields = getProjectFields(ownerInfo, projectNumber);

  for (const desiredField of desiredFields) {
    if (desiredField.type !== "single_select") {
      throw new Error(`Unsupported project field type "${desiredField.type}". Expected "single_select".`);
    }

    const existingField = projectFields.find((field) => field.name === desiredField.name);
    if (existingField) {
      updateSingleSelectField(existingField, desiredField);
    } else {
      createSingleSelectField(projectId, desiredField);
    }

    projectFields = getProjectFields(ownerInfo, projectNumber);
  }

  return projectFields;
}

function createSingleSelectField(projectId, field) {
  return graphql(`
    mutation CreateProjectField {
      createProjectV2Field(
        input: {
          projectId: ${graphqlString(projectId)}
          dataType: SINGLE_SELECT
          name: ${graphqlString(field.name)}
          singleSelectOptions: ${singleSelectOptionsInput(field.options ?? [])}
        }
      ) {
        projectV2Field {
          ... on ProjectV2SingleSelectField {
            id
            name
          }
        }
      }
    }
  `).createProjectV2Field.projectV2Field;
}

function updateSingleSelectField(existingField, desiredField) {
  graphql(`
    mutation UpdateProjectField {
      updateProjectV2Field(
        input: {
          fieldId: ${graphqlString(existingField.id)}
          name: ${graphqlString(desiredField.name)}
          singleSelectOptions: ${singleSelectOptionsInput(desiredField.options ?? [], existingField.options)}
        }
      ) {
        projectV2Field {
          ... on ProjectV2SingleSelectField {
            id
            name
          }
        }
      }
    }
  `);
}

function singleSelectOptionsInput(options, existingOptions = []) {
  return `[${options.map((option) => singleSelectOptionInput(option, existingOptions)).join(", ")}]`;
}

function singleSelectOptionInput(option, existingOptions) {
  const existingOption = existingOptions.find((candidate) => candidate.name === option.name);
  const id = existingOption ? `id: ${graphqlString(existingOption.id)}, ` : "";
  return `{ ${id}name: ${graphqlString(option.name)}, color: ${projectOptionColor(option.color)}, description: ${graphqlString(
    option.description ?? "",
  )} }`;
}

function projectOptionColor(color) {
  const projectColor = String(color ?? "gray").toUpperCase();
  const colors = new Set(["GRAY", "BLUE", "GREEN", "YELLOW", "ORANGE", "RED", "PINK", "PURPLE"]);

  if (!colors.has(projectColor)) {
    throw new Error(`Unsupported project option color "${color}".`);
  }

  return projectColor;
}

function syncProjectViews(ownerInfo, projectNumber, projectId, desiredViews, projectFields) {
  if (desiredViews.length === 0) {
    return;
  }

  const views = listProjectViews(ownerInfo, projectNumber);

  for (const [index, desiredView] of desiredViews.entries()) {
    const existing = views.find((view) => view.name === desiredView.name);
    if (existing) {
      updateProjectView(existing.id, desiredView, projectFields);
      continue;
    }

    if (index === 0 && views[0]) {
      updateProjectView(views[0].id, desiredView, projectFields);
      views[0].name = desiredView.name;
      continue;
    }

    const created = createProjectView(projectId, desiredView);
    updateProjectView(created.id, desiredView, projectFields);
    views.push(created);
  }
}

function updateProjectView(viewId, view, projectFields) {
  const filterInput = view.filter ? `, filter: ${graphqlString(view.filter)}` : "";
  const configurationInput = view.visibleFields
    ? `, configuration: { visibleFieldIds: ${visibleFieldIdsInput(view.visibleFields, projectFields)} }`
    : "";

  graphql(`
      mutation UpdateProjectView {
        updateProjectV2View(
          input: {
            viewId: ${graphqlString(viewId)}
            name: ${graphqlString(view.name)}
            layout: ${projectViewLayout(view.layout)}
            ${filterInput}
            ${configurationInput}
          }
        ) {
          projectV2View {
            id
            name
          }
        }
      }
    `);
}

function createProjectView(projectId, view) {
  return graphql(
    `
      mutation CreateProjectView($projectId: ID!, $name: String!, $layout: ProjectV2ViewLayout!) {
        createProjectV2View(input: { projectId: $projectId, name: $name, layout: $layout }) {
          projectV2View {
            id
            name
          }
        }
      }
    `,
    { projectId, name: view.name, layout: projectViewLayout(view.layout) },
  ).createProjectV2View.projectV2View;
}

function projectViewLayout(layout) {
  const layouts = {
    board: "BOARD_LAYOUT",
    roadmap: "ROADMAP_LAYOUT",
    table: "TABLE_LAYOUT",
  };
  const normalizedLayout = layout ?? "table";
  const projectLayout = layouts[normalizedLayout];

  if (!projectLayout) {
    throw new Error(`Unsupported project view layout "${normalizedLayout}". Expected "board", "table" or "roadmap".`);
  }

  return projectLayout;
}

function visibleFieldIdsInput(visibleFields, projectFields) {
  const ids = visibleFields.map((fieldName) => {
    const field = projectFields.find((projectField) => projectField.name === fieldName);
    if (!field) {
      throw new Error(`Unable to show project field "${fieldName}" in a view because it does not exist.`);
    }

    return field.id;
  });

  return `[${ids.map((id) => graphqlString(id)).join(", ")}]`;
}

function graphqlString(value) {
  return JSON.stringify(String(value));
}

function listProjectViews(ownerInfo, projectNumber) {
  const field = ownerInfo.__typename === "Organization" ? "organization" : "user";
  return graphql(
    `
      query ProjectViews($login: String!, $number: Int!) {
        ${field}(login: $login) {
          projectV2(number: $number) {
            views(first: 20) {
              nodes {
                id
                name
              }
            }
          }
        }
      }
    `,
    { login: ownerInfo.login, number: projectNumber },
  )[field].projectV2.views.nodes;
}

function projectUrl(ownerInfo, projectNumber) {
  const path = ownerInfo.__typename === "Organization" ? "orgs" : "users";
  return `https://github.com/${path}/${ownerInfo.login}/projects/${projectNumber}`;
}

function listProjects(ownerInfo) {
  const field = ownerInfo.__typename === "Organization" ? "organization" : "user";
  return graphql(
    `
      query Projects($login: String!) {
        ${field}(login: $login) {
          projectsV2(first: 100) {
            nodes {
              id
              number
              title
            }
          }
        }
      }
    `,
    { login: ownerInfo.login },
  )[field].projectsV2.nodes;
}

function addIssueToProject(projectId, contentId) {
  return graphql(
    `
      mutation AddItem($projectId: ID!, $contentId: ID!) {
        addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
          item {
            id
          }
        }
      }
    `,
    { projectId, contentId },
  ).addProjectV2ItemById.item;
}

function getProjectFields(ownerInfo, projectNumber) {
  const field = ownerInfo.__typename === "Organization" ? "organization" : "user";
  return graphql(
    `
      query ProjectFields($login: String!, $number: Int!) {
        ${field}(login: $login) {
          projectV2(number: $number) {
            fields(first: 50) {
              nodes {
                ... on ProjectV2Field {
                  id
                  name
                }
                ... on ProjectV2SingleSelectField {
                  id
                  name
                  options {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    `,
    { login: ownerInfo.login, number: projectNumber },
  )[field].projectV2.fields.nodes.filter(Boolean);
}

function setProjectStatus(projectId, itemId, fields, status) {
  if (!status) {
    return;
  }

  const statusField = fields.find((field) => field.name === "Status");
  const option = statusField?.options.find((candidate) => candidate.name === status);

  if (!statusField || !option) {
    return;
  }

  graphql(
    `
      mutation SetStatus($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: $projectId
            itemId: $itemId
            fieldId: $fieldId
            value: { singleSelectOptionId: $optionId }
          }
        ) {
          projectV2Item {
            id
          }
        }
      }
    `,
    { projectId, itemId, fieldId: statusField.id, optionId: option.id },
  );
}

function setTicketWeight(projectId, itemId, fields, weight) {
  if (!weight) {
    return;
  }

  const weightField = fields.find((field) => field.name === "Poids");
  const option = weightField?.options.find((candidate) => candidate.name === weight);

  if (!weightField || !option) {
    throw new Error(
      `Unable to set ticket weight "${weight}". Check that the "Poids" project field contains this option.`,
    );
  }

  graphql(
    `
      mutation SetWeight($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: $projectId
            itemId: $itemId
            fieldId: $fieldId
            value: { singleSelectOptionId: $optionId }
          }
        ) {
          projectV2Item {
            id
          }
        }
      }
    `,
    { projectId, itemId, fieldId: weightField.id, optionId: option.id },
  );
}
