import { afterEach, describe, expect, it, vi } from "vitest";
import { openApiSpecification } from "./openapi";
import { registerSwaggerApi } from "./swagger-api";

const { setupMock } = vi.hoisted(() => ({ setupMock: vi.fn(() => vi.fn()) }));

vi.mock("swagger-ui-express", () => ({
  serve: [vi.fn()],
  setup: setupMock,
}));

const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
  vi.clearAllMocks();
});

describe("registerSwaggerApi", () => {
  it("registers the Swagger UI and the OpenAPI document outside production", () => {
    process.env.NODE_ENV = "test";
    const get = vi.fn();
    const use = vi.fn();

    registerSwaggerApi({ get, use });

    expect(get).toHaveBeenCalledWith("/api-docs/openapi.json", expect.any(Function));
    expect(use).toHaveBeenCalledWith("/api-docs", expect.any(Function), expect.any(Function));
    expect(setupMock).toHaveBeenCalledWith(
      openApiSpecification,
      expect.objectContaining({ customSiteTitle: "The Movie DB Discovery API - Swagger", explorer: true }),
    );
  });

  it("does not expose Swagger routes in production", () => {
    process.env.NODE_ENV = "production";
    const get = vi.fn();
    const use = vi.fn();

    registerSwaggerApi({ get, use });

    expect(get).not.toHaveBeenCalled();
    expect(use).not.toHaveBeenCalled();
  });
});
