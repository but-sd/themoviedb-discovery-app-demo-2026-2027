import type { Express } from "express";
import express from "express";
import { DEFAULT_LANGUAGE, DEFAULT_PAGE, DEFAULT_REGION } from "./constants";
import type { MovieDetails, MoviesApiResponse, TmdbMovieDetails, TmdbMoviesRawResponse } from "./schemas/MoviesTypes";
import { toSupportedMovie, toSupportedMovieDetails } from "./utils";
import { tmdbAccessToken } from "./config";

export function registerMoviesApi(app: Express): void {
  app.get("/api/movies/popular", async (_req: express.Request, res: express.Response) => {
    // Create a URLSearchParams object to build the query string for the TMDB API request
    const queryParams = new URLSearchParams();

    // Extract query parameters from the request and append them to the query string
    const { language, page, region } = _req.query;

    queryParams.append("language", (language as string) || DEFAULT_LANGUAGE);
    queryParams.append("page", (page as string) || DEFAULT_PAGE);
    queryParams.append("region", (region as string) || DEFAULT_REGION);

    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/popular?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${tmdbAccessToken}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      });

      if (!response.ok) {
        throw new Error(`TMDB API request failed with status ${response.status}`);
      }

      // Parse the raw response from the TMDB API
      const rawData = (await response.json()) as TmdbMoviesRawResponse;

      // Transform the raw data into the supported format for our application
      const data: MoviesApiResponse = {
        page: rawData.page,
        results: rawData.results.map(toSupportedMovie),
        total_pages: rawData.total_pages,
        total_results: rawData.total_results,
      };

      // Send the transformed data as a JSON response
      res.json(data);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      res.status(500).json({ error: "Failed to fetch popular movies" });
    }
  });

  app.get("/api/movies/:id", async (_req: express.Request, res: express.Response) => {
    // Create a URLSearchParams object to build the query string for the TMDB API request
    const queryParams = new URLSearchParams();

    // Extract query parameters from the request and append them to the query string
    const { language, page, region } = _req.query;

    queryParams.append("language", (language as string) || DEFAULT_LANGUAGE);
    queryParams.append("page", (page as string) || DEFAULT_PAGE);
    queryParams.append("region", (region as string) || DEFAULT_REGION);

    const movieId = _req.params.id;

    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${tmdbAccessToken}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      });

      if (!response.ok) {
        throw new Error(`TMDB API request failed with status ${response.status}`);
      }

      // Parse the raw response from the TMDB API
      const rawData = (await response.json()) as TmdbMovieDetails;

      // Transform the raw data into the supported format for our application
      const data: MovieDetails = toSupportedMovieDetails(rawData);

      // Send the transformed data as a JSON response
      res.json(data);
    } catch (error) {
      console.error(`Error fetching movie with ID ${movieId}:`, error);
      res.status(500).json({ error: `Failed to fetch movie with ID ${movieId}` });
    }
  });
}
