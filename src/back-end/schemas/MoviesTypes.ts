import { z } from "./zod";

const TmdbMovieBaseSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  id: z.number().int(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  release_date: z.string().date(),
  title: z.string(),
  video: z.boolean().optional(),
  vote_average: z.number(),
  vote_count: z.number().int(),
});
export const TmdbMovieSchema = TmdbMovieBaseSchema.extend({
  genre_ids: z.array(z.number().int()),
});

export const TmdbMoviesRawResponseSchema = z.object({
  page: z.number().int(),
  results: z.array(TmdbMovieSchema),
  total_pages: z.number().int(),
  total_results: z.number().int(),
});

export const TmdbMovieDetailsSchema = TmdbMovieBaseSchema.extend({
  genres: z.array(z.object({ id: z.number().int(), name: z.string() })),
  tagline: z.string().nullable(),
  production_companies: z.array(
    z.object({
      id: z.number().int(),
      logo_path: z.string().nullable(),
      name: z.string(),
      origin_country: z.string(),
    }),
  ),
});

export const MovieSchema = TmdbMovieSchema.omit({ adult: true, video: true });
export const MovieDetailsSchema = TmdbMovieDetailsSchema.omit({
  adult: true,
  video: true,
  production_companies: true,
});
export const MoviesApiResponseSchema = z.object({
  page: z.number().int(),
  results: z.array(MovieSchema),
  total_pages: z.number().int(),
  total_results: z.number().int(),
});
export const ApiErrorResponseSchema = z.object({ error: z.string() });

export type TmdbMovie = z.infer<typeof TmdbMovieSchema>;
export type TmdbMoviesRawResponse = z.infer<typeof TmdbMoviesRawResponseSchema>;
export type TmdbMovieDetails = z.infer<typeof TmdbMovieDetailsSchema>;
export type Movie = z.infer<typeof MovieSchema>;
export type MovieDetails = z.infer<typeof MovieDetailsSchema>;
export type MoviesApiResponse = z.infer<typeof MoviesApiResponseSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
