import type { Movie, MovieDetails } from "../src/back-end/schemas/MoviesTypes";

export const movie1: Movie = {
  backdrop_path: "/7iwUUcKURMT7aKfCwMy6YnGtchD.jpg",
  genre_ids: [878, 28, 12],
  id: 969681,
  original_language: "en",
  original_title: "mock - Spider-Man: Brand New Day - mock",
  overview:
    "Quatre ans se sont écoulés, Peter, désormais adulte, vit seul, s'est volontairement effacé de la vie et des souvenirs de ses proches. Luttant contre le crime dans un New York qui ne le reconnaît plus, il se consacre entièrement à la protection de la ville - un Spider-Man à plein temps - mais à mesure que les responsabilités s'intensifient, la pression provoque une transformation physique surprenante qui menace son existence, tandis qu'une étrange nouvelle vague de crimes donne naissance à l'une des menaces les plus redoutables qu'il ait jamais affrontées.",
  popularity: 1380.7869,
  poster_path: "/yikio8CfJxIA7faZxgvB9FGXy6u.jpg",
  release_date: "2026-07-29",
  title: "mock - Spider-Man: Brand New Day - mock",
  vote_average: 7.9,
  vote_count: 2124,
};

export const movie1Details: MovieDetails = {
  ...movie1,
  genres: [
    { id: 878, name: "Science-Fiction" },
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
  ],
  tagline: "Le monde a peut-être oublié Peter Parker, mais lui, il ne les a pas oubliés.",
};

export const movie2: Movie = {
  backdrop_path: "/z7lZgL5tzefTfhyRtouThFhsuUS.jpg",
  genre_ids: [28, 878, 53],
  id: 1323244,
  original_language: "en",
  original_title: "Rage of Stars",
  overview:
    "L'histoire d'une femme membre des forces spéciales internationales, qui a une prémonition de la fin imminente de l'humanité.",
  popularity: 334.5477,
  poster_path: "/oLld47ZT1I3iecM3OWhIphohQUJ.jpg",
  release_date: "2026-08-06",
  title: "Rage of Stars",
  vote_average: 5.158,
  vote_count: 37,
};

export const movie2Details: MovieDetails = {
  ...movie2,
  genres: [
    { id: 28, name: "Action" },
    { id: 878, name: "Science-Fiction" },
    { id: 53, name: "Thriller" },
  ],
  tagline: "",
};
