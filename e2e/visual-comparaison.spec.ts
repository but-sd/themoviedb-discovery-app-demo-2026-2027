import { expect, test } from "@playwright/test";
import { movie1, movie2 } from "../mocks/mock-data";

const posterPath = new URL("./fixtures/poster.png", import.meta.url).pathname;

test("movies visual non regression", async ({ page }) => {
  await page.route("https://image.tmdb.org/t/p/w185/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "image/png",
      path: posterPath,
    });
  });

  // Mock the API response for popular movies
  await page.route("**/api/movies/popular?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ results: [movie1, movie2] }),
    });
  });

  // Navigate to the movies page
  await page.goto("/movies");

  const movieGrid = page.locator(".movie-grid");

  await expect(movieGrid).toBeVisible();
  await expect(movieGrid).toHaveScreenshot();
});
