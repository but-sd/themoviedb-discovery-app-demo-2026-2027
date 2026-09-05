import { describe, expect, it } from "vitest";
import { openApiSpecification } from "./openapi";

describe("openApiSpecification", () => {
  it("generates reusable component schemas from the backend Zod schemas", () => {
    const popularMoviesPath = openApiSpecification.paths?.["/api/movies/popular"];

    expect(openApiSpecification.components?.schemas?.Movie).toMatchObject({
      type: "object",
      required: expect.arrayContaining(["id", "genre_ids", "title"]),
    });
    expect(openApiSpecification.components?.schemas?.MovieDetails).toMatchObject({
      type: "object",
      required: expect.arrayContaining(["genres", "tagline"]),
    });
    expect(popularMoviesPath?.get?.responses?.["200"]).toMatchObject({
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/MoviesApiResponse" },
        },
      },
    });
  });
});
