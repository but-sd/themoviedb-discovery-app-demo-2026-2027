import type { Movie } from "../../../back-end/schemas/MoviesTypes";
import { getPosterUrl, getRating, getReleaseYear } from "../MovieUtils";
import "./MovieCard.css";
import { Link } from "react-router";

type MovieItemProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieItemProps) {
  const releaseYear = getReleaseYear(movie.release_date);
  const posterUrl = getPosterUrl(movie.poster_path, "w185");
  const rating = getRating(movie.vote_average);
  // const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w185${movie.poster_path}` : null;

  return (
    <article aria-label={`Film ${movie.title}`}>
      <Link to={`/movie/${movie.id}`} className="movie-card-link">
        <div className="movie-card">
          {posterUrl ? (
            <img className="movie-poster" src={posterUrl} alt={`Affiche de ${movie.title}`} />
          ) : (
            <div className="movie-poster movie-poster--fallback" aria-hidden="true" />
          )}
          <div className="movie-card__content">
            <h2>{movie.title}</h2>
            <p>
              {releaseYear} · Note {rating}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
