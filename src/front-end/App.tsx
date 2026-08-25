import { Navigate, Route, Routes } from "react-router";
import "./app.css";
import MovieDetailPage from "./pages/MovieDetailPage";
import MoviesListPage from "./pages/MoviesListPage";
import NotFoundPage from "./pages/NotFoundPage";
import AboutPage from "./pages/AboutPage";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/movies" replace />} />
        <Route path="/movies" element={<MoviesListPage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}
