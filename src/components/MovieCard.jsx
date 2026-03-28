import React from "react";
import { useNavigate } from "react-router-dom";
import { StarFilled } from "@ant-design/icons";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  const fallbackPoster = `https://placehold.co/300x450/1a1a1a/e50914?text=${encodeURIComponent(movie.title)}`;

  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie._id}`)}>
      <img
        src={
          movie.posterUrl
            ? movie.posterUrl.replace("/w500", "/w342")
            : fallbackPoster
        }
        alt={movie.title}
        onError={(e) => {
          e.target.src = fallbackPoster;
        }}
        loading="lazy"
      />
      <div className="movie-card-badges">
        <span className="badge-type">{movie.type}</span>
        {movie.rating > 0 && (
          <span className="imdb-badge">
            <StarFilled style={{ fontSize: 9, marginRight: 2 }} />
            {movie.rating.toFixed(1)}
          </span>
        )}
      </div>
      <div className="movie-card-overlay">
        <div className="movie-card-title">{movie.title}</div>
        <div className="movie-card-meta">
          <span>{movie.releaseYear}</span>
          {movie.genre?.[0] && <span>• {movie.genre[0]}</span>}
          {movie.duration && <span>• {movie.duration}</span>}
        </div>
      </div>
    </div>
  );
}
