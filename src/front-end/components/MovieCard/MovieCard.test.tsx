// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import MovieCard from "./MovieCard";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { movie1 } from "../../../../mocks/mock-data";

describe("MovieCard component", () => {
  it("renders the movie card correctly with correct movie data", () => {
    render(
      <MemoryRouter>
        <MovieCard movie={movie1} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("article", { name: `Film ${movie1.title}` })).toBeTruthy();
    expect(screen.getByRole("heading", { name: movie1.title })).toBeTruthy();
    expect(screen.getByText("2024 · Note 7.8")).toBeTruthy();

    const movieLink = screen.getByRole("link", { name: new RegExp(movie1.title) });
    expect(movieLink.getAttribute("href")).toBe(`/movie/${movie1.id}`);
  });

  it("renders a fallback poster when poster_path is null", () => {
    const movieWithoutPoster = { ...movie1, poster_path: null };

    render(
      <MemoryRouter>
        <MovieCard movie={movieWithoutPoster} />
      </MemoryRouter>,
    );

    const fallbackPoster = screen.getByRole("img", { hidden: true });
    expect(fallbackPoster).toBeTruthy();
  });
});
