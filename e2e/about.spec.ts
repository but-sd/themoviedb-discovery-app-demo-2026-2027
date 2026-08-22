import { expect, test } from "@playwright/test";
import packageJson from "../package.json" with { type: "json" };

test("affiche la page about", async ({ page }) => {
  await page.goto("/about");

  await expect(page).toHaveTitle("themoviedb-discovery-app");
  await expect(page.getByRole("heading", { name: "À propos" })).toBeVisible();
  await expect(page.getByRole("link", { name: "About" })).toBeVisible();
  await expect(page.getByRole("contentinfo")).toContainText(
    new RegExp(`TMDB Discovery\\s*Version ${packageJson.version}`),
  );
});
