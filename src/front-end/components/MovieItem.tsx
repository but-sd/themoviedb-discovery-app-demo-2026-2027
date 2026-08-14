import type { Movie } from "../../back-end/schemas/MoviesTypes";

type MovieItemProps = {
  movie: Movie;
};

export default function MovieItem({ movie }: MovieItemProps) {
  const releaseYear = movie.release_date.slice(0, 4);
  const posterUrl = `https://image.tmdb.org/t/p/w185${movie.poster_path}`;

  return (
    <article>
      <img src={posterUrl} alt={movie.title} />
      <h2>{movie.title}</h2>
      <p>Release Year: {releaseYear}</p>
      <p>Rating: {movie.vote_average}</p>
    </article>
  );
}
