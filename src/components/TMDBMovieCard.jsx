import React from "react";
import { StarFilled } from "@ant-design/icons";

export default function TMDBMovieCard({ movie, onClick }) {
  const fallback = `https://placehold.co/300x450/1a1a1a/e50914?text=${encodeURIComponent(movie.title || "No Title")}`;

  return (
    <div className="movie-card" onClick={onClick}>
      <img
        src={movie.posterUrl ? movie.posterUrl.replace("/w500", "/w342") : fallback}
        srcSet={movie.posterUrl ? `${movie.posterUrl.replace("/w500", "/w185")} 185w, ${movie.posterUrl.replace("/w500", "/w342")} 342w, ${movie.posterUrl.replace("/w500", "/w500")} 500w` : ""}
        sizes="(max-width: 600px) 120px, 170px"
        alt={movie.title}
        onError={(e) => {
          e.target.src = fallback;
          e.target.srcset = "";
        }}
        loading="lazy"
        decoding="async"
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
          {movie.releaseYear && <span>{movie.releaseYear}</span>}
          {movie.type === "movie" ? (
            <span>• Movie</span>
          ) : (
            <span>• Series</span>
          )}
        </div>
      </div>
    </div>
  );
}
