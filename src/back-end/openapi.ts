import { OpenAPIRegistry, OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { z } from "./schemas/zod";
import {
  ApiErrorResponseSchema,
  MovieDetailsSchema,
  MovieSchema,
  MoviesApiResponseSchema,
} from "./schemas/MoviesTypes";

const registry = new OpenAPIRegistry();

const HealthResponseSchema = registry.register(
  "HealthResponse",
  z.object({ status: z.literal("ok") }).describe("Etat de disponibilite du service."),
);
const ApiErrorSchema = registry.register("ApiErrorResponse", ApiErrorResponseSchema);
registry.register("Movie", MovieSchema);
const MovieDetailsSchemaReference = registry.register("MovieDetails", MovieDetailsSchema);
const MoviesApiResponseSchemaReference = registry.register("MoviesApiResponse", MoviesApiResponseSchema);

registry.registerPath({
  method: "get",
  path: "/api/health",
  tags: ["Health"],
  summary: "Verifie la disponibilite du service",
  operationId: "getHealth",
  responses: {
    200: {
      description: "Le service est operationnel.",
      content: { "application/json": { schema: HealthResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/movies/popular",
  tags: ["Movies"],
  summary: "Liste les films populaires",
  operationId: "getPopularMovies",
  request: {
    query: z.object({
      language: z.string().optional().describe("Code de langue BCP 47. La valeur par defaut est fr-FR."),
      page: z.coerce
        .number()
        .int()
        .min(1)
        .optional()
        .describe("Numero de la page a consulter. La valeur par defaut est 1."),
      region: z.string().length(2).optional().describe("Code pays ISO 3166-1 alpha-2. La valeur par defaut est FR."),
    }),
  },
  responses: {
    200: {
      description: "Une page de films populaires.",
      content: { "application/json": { schema: MoviesApiResponseSchemaReference } },
    },
    500: {
      description: "La liste des films populaires n'a pas pu etre recuperee.",
      content: { "application/json": { schema: ApiErrorSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/movies/{id}",
  tags: ["Movies"],
  summary: "Recupere les details d'un film",
  operationId: "getMovieById",
  request: {
    params: z.object({ id: z.coerce.number().int().min(1).describe("Identifiant TMDB du film.") }),
  },
  responses: {
    200: {
      description: "Les details du film demande.",
      content: { "application/json": { schema: MovieDetailsSchemaReference } },
    },
    500: {
      description: "Les details du film n'ont pas pu etre recuperes.",
      content: { "application/json": { schema: ApiErrorSchema } },
    },
  },
});

export const openApiSpecification = new OpenApiGeneratorV31(registry.definitions).generateDocument({
  openapi: "3.1.0",
  info: {
    title: "The Movie DB Discovery API",
    version: "1.0.0",
    description: "API de consultation des films populaires et de leurs details depuis TMDB.",
  },
  servers: [{ url: "/" }],
  tags: [
    { name: "Health", description: "Etat de disponibilite du service." },
    { name: "Movies", description: "Consultation du catalogue de films." },
  ],
});
