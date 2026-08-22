import { expect, test } from "@playwright/test";
import { movie1, movie1Details, movie2 } from "../mocks/mock-data";

test("shows the movies page and navigate to a movie detail", async ({ page }) => {
  // Mock the API response for popular movies
  await page.route("**/api/movies/popular?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ results: [movie1, movie2] }),
    });
  });

  // Mock the API response for movie details
  await page.route(`**/api/movies/${movie1.id}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(movie1Details),
    });
  });

  // Navigate to the movies page
  await page.goto("/movies");

  // Check that the movie title is visible on the page for the first movie in the mocked response
  await expect(page.getByRole("heading", { name: movie1.title })).toBeVisible();
  // Check that the movie title is visible on the page for the second movie in the mocked response
  await expect(page.getByRole("heading", { name: movie2.title })).toBeVisible();

  // Click on the accessible movie article to navigate to the detail page
  await page.getByRole("article", { name: `Film ${movie1.title}` }).click();

  // Check that the movie detail page is displayed with the correct title
  await expect(page.getByRole("heading", { name: `Détails du film` })).toBeVisible();
  await expect(page.getByRole("heading", { name: movie1.title })).toBeVisible();

  // Click on the back link to return to the movies page
  await page.getByRole("link", { name: "← Retour vers les films" }).click();

  // Check that url is back to the movies page
  await expect(page).toHaveURL("/movies");
});
