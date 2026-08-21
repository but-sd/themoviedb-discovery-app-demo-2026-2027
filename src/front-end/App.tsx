import { Route, Routes } from "react-router";
import "./app.css";
import MovieDetailPage from "./pages/MovieDetailPage";
import MoviesListPage from "./pages/MoviesListPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MoviesListPage />} />
      <Route path="/movie/:id" element={<MovieDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
