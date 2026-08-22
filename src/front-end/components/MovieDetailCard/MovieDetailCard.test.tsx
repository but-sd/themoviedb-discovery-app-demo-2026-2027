// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import MovieDetailCard from "./MovieDetailCard";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { movie1Details } from "../../../../mocks/mock-data";

describe("MovieDetailCard component", () => {
  it("renders the movie detail card correctly with correct movie data", () => {
    render(
      <MemoryRouter>
        <MovieDetailCard movie={movie1Details} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("article", { name: `Détails du film ${movie1Details.title}` })).toBeTruthy();
    expect(screen.getByRole("heading", { name: movie1Details.title })).toBeTruthy();
    expect(screen.getByText("2024")).toBeTruthy();
    expect(screen.getByText("7.8")).toBeTruthy();
    expect(screen.getByText(movie1Details.overview)).toBeTruthy();

    // const genresList = screen.getByRole("list");
    // movie1Details.genres.forEach((genre) => {
    //     expect(genresList).toHaveTextContent(genre.name);
    // });
  });

  it("renders a fallback poster when poster_path is null", () => {
    const movieWithoutPoster = { ...movie1Details, poster_path: null };

    render(
      <MemoryRouter>
        <MovieDetailCard movie={movieWithoutPoster} />
      </MemoryRouter>,
    );

    const fallbackPoster = screen.getByRole("img", { hidden: true });
    expect(fallbackPoster).toBeTruthy();
  });
});
