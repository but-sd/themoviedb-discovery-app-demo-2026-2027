import { expect, test } from "@playwright/test";

test("affiche la page des films", async ({ page }) => {
  await page.route("**/api/movies/popular**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      }),
    });
  });

  await page.goto("/movies");

  await expect(page).toHaveTitle("themoviedb-discovery-app");
  await expect(page.getByRole("heading", { name: "Films populaires" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Movies" })).toBeVisible();
  await expect(page.getByRole("contentinfo")).toContainText(`Version `);
});
