import { beforeEach, describe, expect, it, vi } from "vitest";

const { getMock, listenMock, fetchMock, toSupportedMovieMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
  listenMock: vi.fn(),
  fetchMock: vi.fn(),
  toSupportedMovieMock: vi.fn(),
}));

vi.mock("express", () => ({
  default: vi.fn(() => ({
    get: getMock,
    listen: listenMock,
  })),
}));

vi.mock("./config", () => ({
  tmdbAccessToken: "test-access-token",
}));

vi.mock("./constants", () => ({
  DEFAULT_LANGUAGE: "en-US",
  DEFAULT_PAGE: "1",
  DEFAULT_REGION: "US",
}));

vi.mock("./utils", () => ({
  toSupportedMovie: toSupportedMovieMock,
}));

vi.stubGlobal("fetch", fetchMock);

import "./index";

type Request = {
  query: Record<string, unknown>;
};

type Response = {
  send: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
  status: ReturnType<typeof vi.fn>;
};

type RouteHandler = (req: Request, res: Response) => void | Promise<void>;

const routeHandlers = new Map<string, RouteHandler>(
  getMock.mock.calls.map(([path, handler]) => [path as string, handler as RouteHandler]),
);
// const serverWasStarted = listenMock.mock.calls.some(([port]) => port === 3000);

// const createResponse = (): Response => {
//     const response: Response = {
//         send: vi.fn(),
//         json: vi.fn(),
//         status: vi.fn(),
//     };

//     response.status.mockReturnValue(response);

//     return response;
// };

describe("back-end server routes", () => {
  // Clear mocks before each test to ensure isolation
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("server setup", () => {
    it("registers the / route", () => {
      expect(routeHandlers.has("/")).toBe(true);
    });

    it("registers the /api/movies/popular route", () => {
      expect(routeHandlers.has("/api/movies/popular")).toBe(true);
    });

    it("registers the /api/health route", () => {
      expect(routeHandlers.has("/api/health")).toBe(true);
    });
  });

  // it("registers the server on port 3000", () => {
  //     expect(serverWasStarted).toBe(true);
  // });

  // it("returns an OK health-check response", () => {
  //     const handler = routeHandlers.get("/api/health");
  //     const response = createResponse();

  //     handler?.({ query: {} }, response);

  //     expect(response.json).toHaveBeenCalledWith({ status: "ok" });
  // });

  // it("fetches, transforms, and returns popular movies using default query parameters", async () => {
  //     const rawMovie = {
  //         id: 1,
  //         title: "Raw Movie",
  //         overview: "A raw movie response",
  //     };

  //     const supportedMovie = {
  //         id: 1,
  //         title: "Supported Movie",
  //     };

  //     fetchMock.mockResolvedValue({
  //         ok: true,
  //         json: vi.fn().mockResolvedValue({
  //             page: 1,
  //             results: [rawMovie],
  //             total_pages: 10,
  //             total_results: 200,
  //         }),
  //     });

  //     toSupportedMovieMock.mockReturnValue(supportedMovie);

  //     const handler = routeHandlers.get("/api/movies/popular");
  //     const response = createResponse();

  //     await handler?.({ query: {} }, response);

  //     expect(fetchMock).toHaveBeenCalledWith(
  //         "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&region=US",
  //         {
  //             headers: {
  //                 Authorization: "Bearer test-access-token",
  //                 "Content-Type": "application/json;charset=utf-8",
  //             },
  //         },
  //     );

  //     expect(toSupportedMovieMock.mock.calls[0]?.[0]).toEqual(rawMovie);

  //     expect(response.json).toHaveBeenCalledWith({
  //         page: 1,
  //         results: [supportedMovie],
  //         total_pages: 10,
  //         total_results: 200,
  //     });
  // });

  // it("uses supplied popular movie query parameters", async () => {
  //     fetchMock.mockResolvedValue({
  //         ok: true,
  //         json: vi.fn().mockResolvedValue({
  //             page: 2,
  //             results: [],
  //             total_pages: 2,
  //             total_results: 20,
  //         }),
  //     });

  //     const handler = routeHandlers.get("/api/movies/popular");
  //     const response = createResponse();

  //     await handler?.(
  //         {
  //             query: {
  //                 language: "fr-FR",
  //                 page: "2",
  //                 region: "FR",
  //             },
  //         },
  //         response,
  //     );

  //     expect(fetchMock).toHaveBeenCalledWith(
  //         "https://api.themoviedb.org/3/movie/popular?language=fr-FR&page=2&region=FR",
  //         expect.any(Object),
  //     );

  //     expect(response.json).toHaveBeenCalledWith({
  //         page: 2,
  //         results: [],
  //         total_pages: 2,
  //         total_results: 20,
  //     });
  // });

  // it("returns a 500 response when the TMDB API request fails", async () => {
  //     fetchMock.mockResolvedValue({
  //         ok: false,
  //         status: 401,
  //     });

  //     const handler = routeHandlers.get("/api/movies/popular");
  //     const response = createResponse();

  //     await handler?.({ query: {} }, response);

  //     expect(response.status).toHaveBeenCalledWith(500);
  //     expect(response.json).toHaveBeenCalledWith({
  //         error: "Failed to fetch popular movies",
  //     });
  // });

  // it("returns a 500 response when fetching from TMDB throws", async () => {
  //     fetchMock.mockRejectedValue(new Error("Network error"));

  //     const handler = routeHandlers.get("/api/movies/popular");
  //     const response = createResponse();

  //     await handler?.({ query: {} }, response);

  //     expect(response.status).toHaveBeenCalledWith(500);
  //     expect(response.json).toHaveBeenCalledWith({
  //         error: "Failed to fetch popular movies",
  //     });
  // });
});
