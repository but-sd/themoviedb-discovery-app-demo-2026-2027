/**
 * Get the release year from a release date string.
 * @param releaseDate - The release date string in the format "YYYY-MM-DD".
 * @returns The release year as a string.
 */

export function getReleaseYear(releaseDate: string): string {
  const date = new Date(releaseDate);
  return Number.isNaN(date.getTime()) ? "Unknown" : date.getUTCFullYear().toString();
}
/**
 * Get the full poster URL from a poster path.
 * If the poster path is null, return null.
 * @param posterPath - The poster path string or null.
 * @param size - The requested poster size, either "w185" or "w300". Defaults to "w185".
 * @returns The full poster URL as a string, or null if the poster path is null.
 */

export function getPosterUrl(posterPath: string | null, size: "w185" | "w300" = "w185"): string | null {
  return posterPath ? `https://image.tmdb.org/t/p/${size}${posterPath}` : null;
}
/**
 *  Get the rating from a vote average number, formatted to one decimal place.
 * @param voteAverage - The vote average number.
 * @returns The rating as a string formatted to one decimal place.
 */

export function getRating(voteAverage: number): string {
  return voteAverage.toFixed(1);
}
