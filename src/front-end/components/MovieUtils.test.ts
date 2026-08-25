import { describe, it, expect } from "vitest";
import { getReleaseYear, getPosterUrl, getRating } from "./MovieUtils";

describe("MovieUtils", () => {
  describe("getReleaseYear", () => {
    it("should return the release year from a valid date string", () => {
      const dateString = "2024-05-15";
      const result = getReleaseYear(dateString);
      expect(result).toBe("2024");
    });

    it("should return 'Unknown' for an invalid date string", () => {
      const invalidDateString = "invalid-date";
      const result = getReleaseYear(invalidDateString);
      expect(result).toBe("Unknown");
    });
  });

  describe("getPosterUrl", () => {
    it("should return the full poster URL for a valid poster path with default size", () => {
      const posterPath = "/poster.jpg";
      const result = getPosterUrl(posterPath);
      expect(result).toBe("https://image.tmdb.org/t/p/w185/poster.jpg");
    });

    it("should return the full poster URL for a valid poster path with specified size", () => {
      const posterPath = "/poster.jpg";
      const result = getPosterUrl(posterPath, "w300");
      expect(result).toBe("https://image.tmdb.org/t/p/w300/poster.jpg");
    });

    it("should return null for a null poster path", () => {
      const result = getPosterUrl(null);
      expect(result).toBeNull();
    });

    it("should use the requested poster size", () => {
      const result = getPosterUrl("/poster.jpg", "w185");
      expect(result).toBe("https://image.tmdb.org/t/p/w185/poster.jpg");
    });
  });

  describe("getRating", () => {
    it("should return the rating formatted to one decimal place", () => {
      const voteAverage = 7.856;
      const result = getRating(voteAverage);
      expect(result).toBe("7.9");
    });
  });
});
