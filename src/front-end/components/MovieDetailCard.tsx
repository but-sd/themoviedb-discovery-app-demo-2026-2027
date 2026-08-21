import type { MovieDetails } from "../../back-end/schemas/MoviesTypes";
import "./MovieDetailCard/MovieDetailCard.css";

export default function MovieDetailCard({ movie }: { movie: MovieDetails }) {
  const releaseYear = movie.release_date.slice(0, 4);
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null;
  const rating = movie.vote_average.toFixed(1);

  return (
    <article className="movie-detail-card">
      {posterUrl ? (
        <img className="movie-detail-hero" src={posterUrl} alt={`Affiche de ${movie.title}`} />
      ) : (
        <div className="movie-detail-hero movie-detail-hero-placeholder" aria-hidden="true" />
      )}
      <div className="movie-detail-copy">
        <p className="movie-detail-kicker">Détails du film</p>
        <h1>{movie.title}</h1>
        {movie.tagline && <p className="movie-detail-tagline">{movie.tagline}</p>}
        <div className="movie-detail-meta">
          <span>{releaseYear}</span>
          <span>Note {rating}</span>
        </div>
        {movie.genres.length > 0 && (
          <ul className="movie-detail-genres" aria-label="Genres">
            {movie.genres.map((genre) => (
              <li key={genre.id}>{genre.name}</li>
            ))}
          </ul>
        )}
        <section className="movie-detail-section">
          <h2>Résumé</h2>
          <p>{movie.overview}</p>
        </section>
      </div>
    </article>
  );
}
