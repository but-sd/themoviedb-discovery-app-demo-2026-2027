import type { Movie, MovieDetails } from "../src/back-end/schemas/MoviesTypes";

export const movie1: Movie = {
  backdrop_path: "/path/to/backdrop.jpg",
  genre_ids: [28, 12, 16],
  id: 1,
  original_language: "en",
  original_title: "Original Movie1 Title",
  overview: "Ceci est un bref aperçu du film Movie1.",
  popularity: 8.5,
  poster_path: "/path/to/poster.jpg",
  release_date: "2024-01-01",
  title: "Film1 Title",
  vote_average: 7.8,
  vote_count: 1500,
};

export const movie1Details: MovieDetails = {
  ...movie1,
  genres: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
  ],
  tagline: "Ceci est le slogan du film.",
};

export const movie2: Movie = {
  backdrop_path: "/path/to/backdrop2.jpg",
  genre_ids: [35, 18],
  id: 67890,
  original_language: "fr",
  original_title: "Titre Original du Film",
  overview: "Ceci est un bref aperçu du film.",
  popularity: 7.2,
  poster_path: "/path/to/poster2.jpg",
  release_date: "2024-02-01",
  title: "Titre du Film",
  vote_average: 6.5,
  vote_count: 800,
};

export const movie2Details: MovieDetails = {
  ...movie2,
  genres: [
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
  ],
  tagline: "Ceci est le slogan du film.",
};
