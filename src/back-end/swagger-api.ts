import type { Express } from "express";
import * as swaggerUi from "swagger-ui-express";
import { openApiSpecification } from "./openapi";

type SwaggerApp = Pick<Express, "get" | "use">;

export function registerSwaggerApi(app: SwaggerApp): void {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  app.get("/api-docs/openapi.json", (_req, res) => {
    res.json(openApiSpecification);
  });
  app.use(
    "/api-docs",
    ...swaggerUi.serve,
    swaggerUi.setup(openApiSpecification, {
      customSiteTitle: "The Movie DB Discovery API - Swagger",
      explorer: true,
    }),
  );
}
