import type { OpenAPIObject } from "openapi3-ts/oas31";

export const openApiSpecification: OpenAPIObject = {
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
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Verifie la disponibilite du service",
        operationId: "getHealth",
        responses: {
          "200": {
            description: "Le service est operationnel.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/api/movies/popular": {
      get: {
        tags: ["Movies"],
        summary: "Liste les films populaires",
        operationId: "getPopularMovies",
        parameters: [
          { $ref: "#/components/parameters/Language" },
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/Region" },
        ],
        responses: {
          "200": {
            description: "Une page de films populaires.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MoviesApiResponse" },
              },
            },
          },
          "500": { $ref: "#/components/responses/PopularMoviesError" },
        },
      },
    },
    "/api/movies/{id}": {
      get: {
        tags: ["Movies"],
        summary: "Recupere les details d'un film",
        operationId: "getMovieById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Identifiant TMDB du film.",
            schema: { type: "integer", minimum: 1 },
          },
        ],
        responses: {
          "200": {
            description: "Les details du film demande.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MovieDetails" },
              },
            },
          },
          "500": { $ref: "#/components/responses/MovieDetailsError" },
        },
      },
    },
  },
  components: {
    parameters: {
      Language: {
        name: "language",
        in: "query",
        description: "Code de langue BCP 47.",
        schema: { type: "string", default: "fr-FR", example: "fr-FR" },
      },
      Page: {
        name: "page",
        in: "query",
        description: "Numero de la page a consulter.",
        schema: { type: "integer", minimum: 1, default: 1 },
      },
      Region: {
        name: "region",
        in: "query",
        description: "Code pays ISO 3166-1 alpha-2.",
        schema: { type: "string", minLength: 2, maxLength: 2, default: "FR", example: "FR" },
      },
    },
    responses: {
      PopularMoviesError: {
        description: "La liste des films populaires n'a pas pu etre recuperee.",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/ApiErrorResponse" } },
        },
      },
      MovieDetailsError: {
        description: "Les details du film n'ont pas pu etre recuperes.",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/ApiErrorResponse" } },
        },
      },
    },
    schemas: {
      HealthResponse: {
        type: "object",
        required: ["status"],
        properties: { status: { type: "string", const: "ok" } },
      },
      ApiErrorResponse: {
        type: "object",
        required: ["error"],
        properties: { error: { type: "string" } },
      },
      Movie: {
        type: "object",
        required: [
          "backdrop_path",
          "genre_ids",
          "id",
          "original_language",
          "original_title",
          "overview",
          "popularity",
          "poster_path",
          "release_date",
          "title",
          "vote_average",
          "vote_count",
        ],
        properties: {
          backdrop_path: { type: ["string", "null"] },
          genre_ids: { type: "array", items: { type: "integer" } },
          id: { type: "integer" },
          original_language: { type: "string" },
          original_title: { type: "string" },
          overview: { type: "string" },
          popularity: { type: "number" },
          poster_path: { type: ["string", "null"] },
          release_date: { type: "string", format: "date" },
          title: { type: "string" },
          vote_average: { type: "number" },
          vote_count: { type: "integer" },
        },
      },
      MovieDetails: {
        allOf: [
          { $ref: "#/components/schemas/Movie" },
          {
            type: "object",
            required: ["genres", "tagline"],
            properties: {
              genres: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "name"],
                  properties: { id: { type: "integer" }, name: { type: "string" } },
                },
              },
              tagline: { type: ["string", "null"] },
            },
          },
        ],
      },
      MoviesApiResponse: {
        type: "object",
        required: ["page", "results", "total_pages", "total_results"],
        properties: {
          page: { type: "integer" },
          results: { type: "array", items: { $ref: "#/components/schemas/Movie" } },
          total_pages: { type: "integer" },
          total_results: { type: "integer" },
        },
      },
    },
  },
};
