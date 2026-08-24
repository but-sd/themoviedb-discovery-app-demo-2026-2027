import type { MovieDetails } from "../../../back-end/schemas/MoviesTypes";
import { getReleaseYear, getPosterUrl, getRating } from "../MovieUtils";
import "./MovieDetailCard.css";

export default function MovieDetailCard({ movie }: { movie: MovieDetails }) {
  const releaseYear = getReleaseYear(movie.release_date);
  const posterUrl = getPosterUrl(movie.poster_path, "w300");
  const rating = getRating(movie.vote_average);

  return (
    <article className="movie-detail-card" aria-label={`Détails du film ${movie.title}`}>
      <figure className="movie-detail-hero-container">
        {posterUrl ? (
          <img className="movie-detail-hero" src={posterUrl} alt={`Affiche de ${movie.title}`} />
        ) : (
          <div className="movie-detail-hero movie-detail-hero-placeholder" aria-hidden="true" />
        )}
      </figure>
      <div className="movie-detail-copy">
        <header>
          <p className="movie-detail-kicker">Détails du film</p>
          <h1>{movie.title}</h1>
          {movie.tagline && <p className="movie-detail-tagline">{movie.tagline}</p>}
        </header>
        <dl className="movie-detail-meta">
          <div>
            <dt>Année de sortie</dt>
            <dd>{releaseYear}</dd>
          </div>
          <div>
            <dt>Note</dt>
            <dd>{rating}</dd>
          </div>
        </dl>
        {Array.isArray(movie.genres) && movie.genres.length > 0 && (
          <section className="movie-detail-section">
            <h2>Genres</h2>
            <ul className="movie-detail-genres" aria-label="list-genre">
              {movie.genres.map((genre) => (
                <li key={genre.id}>{genre.name}</li>
              ))}
            </ul>
          </section>
        )}
        <section className="movie-detail-section">
          <h2>Résumé</h2>
          <p>{movie.overview}</p>
        </section>
      </div>
    </article>
  );
}
