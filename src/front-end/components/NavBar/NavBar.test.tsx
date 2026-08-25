// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import NavBar from "./NavBar";
import { render, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";

/**
 * Renders the NavBar component at a specific route using MemoryRouter.
 * This allows testing the active link based on the current route.
 * @param route
 * @returns
 */
function renderNavBarAt(route: string) {
  const { container } = render(
    <MemoryRouter initialEntries={[route]}>
      <NavBar />
    </MemoryRouter>,
  );

  return within(container);
}

/**
 * Checks for the common navigation elements in the NavBar component.
 * @param view
 */
function expectCommonNavigation(view: ReturnType<typeof within>) {
  expect(view.getByRole("navigation", { name: "Main navigation" })).toBeTruthy();
  expect(view.getByRole("link", { name: "Films populaires" })).toBeTruthy();
  expect(view.getByRole("link", { name: "À propos" })).toBeTruthy();
}

describe("NavBar component", () => {
  it("renders the navigation links correctly on the movies page", () => {
    const view = renderNavBarAt("/movies");

    expectCommonNavigation(view);

    const moviesLink = view.getByRole("link", { name: "Films populaires" });
    expect(moviesLink.className).toContain("app-nav-link-active");
  });

  it("renders the navigation links correctly on the about page", () => {
    const view = renderNavBarAt("/about");

    expectCommonNavigation(view);

    const aboutLink = view.getByRole("link", { name: "À propos" });
    expect(aboutLink.className).toContain("app-nav-link-active");
  });
});
