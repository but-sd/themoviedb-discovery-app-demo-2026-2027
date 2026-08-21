import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { MovieDetails } from "../../back-end/schemas/MoviesTypes";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();

  // State to hold the fetched movie details data, initialized to null
  const [movie, setMovie] = useState<MovieDetails | null>(null);

  // useEffect hook to fetch data from an API when the component mounts
  useEffect(() => {
    // fetch data from an API /api/movies/{id}
    fetch(`/api/movies/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched movie details data:", data); // Log the fetched data for debugging
        setMovie(data); // Update the state with the fetched movie details data
      });
  }, [id]); // Dependency for the useEffect hook

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Détails du film</h1>
        <Link className="back-link" to="/movies">
          ← Retour vers les films populaires
        </Link>
      </header>
      <section>
        {movie ? (
          <div className="movie-details">
            <h2>{movie.title}</h2>
            <p>{movie.overview}</p>
            <p>Release Date: {movie.release_date}</p>
            <p>Rating: {movie.vote_average}</p>
            {/* Add more movie details as needed */}
          </div>
        ) : (
          <p className="status-message">Loading...</p>
        )}
      </section>
    </main>
  );
}
