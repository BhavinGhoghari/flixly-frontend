import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tag, Spin, Skeleton } from "antd";
import {
  PlayCircleOutlined,
  InfoCircleOutlined,
  StarFilled,
  FireFilled,
  ThunderboltFilled,
  ClockCircleOutlined,
  RiseOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { tmdb } from "../../utils/api";
import TMDBMovieCard from "../../components/TMDBMovieCard";
import TrailerModal from "../../components/TrailerModal";
import MovieSection from "../../components/MovieSection";

import SkeletonSection from "../../components/SkeletonSection";

export default function HomePage() {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    try {
      setLoadingHero(true);
      const trendRes = await tmdb.getTrending("week");
      const tr = trendRes.data.results || [];
      setTrending(tr);
      const withBackdrop = tr.find(item => item.backdropUrl) || tr[0];
      setFeatured(withBackdrop || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHero(false);
      setLoadingInitial(false);
    }
  };

  const handleWatchTrailer = async () => {
    if (!featured) return;
    try {
      const fn =
        featured.type === "series" ? tmdb.getSeriesDetail : tmdb.getMovieDetail;
      const res = await fn(featured.tmdbId);
      setTrailerUrl(res.data.trailerUrl || "");
      setTrailerOpen(true);
    } catch {}
  };

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh" }}>
      {/* ── HERO ── */}
      {loadingHero ? (
        <div className="hero-section">
          <div className="hero-content">
            <Skeleton active paragraph={{ rows: 3 }} title={{ width: "40%" }} />
          </div>
        </div>
      ) : (
        featured && (
          <div className="hero-section">
            <img
              className="hero-bg"
              src={featured.backdropUrl || featured.posterUrl}
              alt=""
              fetchpriority="high"
              decoding="async"
            />
            <div className="hero-gradient" />
            <div className="hero-content">
              <div style={{ marginBottom: 16 }}>
                <span
                  className="badge-type"
                  style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                >
                  {featured.type}
                </span>
                {featured.releaseYear && (
                  <span
                    style={{
                      marginLeft: 12,
                      color: "#ccc",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    {featured.releaseYear}
                  </span>
                )}
              </div>
              <h1 className="hero-title">{featured.title}</h1>
              <div className="hero-meta">
                {featured.rating > 0 && (
                  <span
                    className="imdb-badge"
                    style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                  >
                    <StarFilled style={{ fontSize: 12, marginRight: 4 }} />
                    {featured.rating.toFixed(1)} TMDb
                  </span>
                )}
              </div>
              <p className="hero-desc">{featured.description}</p>
              <div className="hero-buttons" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Button
                  className="hero-btn-primary"
                  icon={<PlayCircleOutlined />}
                  onClick={handleWatchTrailer}
                >
                  WATCH TRAILER
                </Button>
                <Button
                  className="hero-btn-secondary"
                  icon={<InfoCircleOutlined />}
                  onClick={() =>
                    navigate(`/movie/${featured.tmdbId}?type=${featured.type}`)
                  }
                >
                  MORE INFO
                </Button>
              </div>
            </div>
          </div>
        )
      )}

      <div
        className="home-container"
        style={{
          padding: "40px 60px",
          maxWidth: 1800,
          margin: "0 auto",
          position: "relative",
          zIndex: 5,
        }}
      >
        {loadingInitial ? (
          <>
            <SkeletonSection title="Trending This Week" />
            <SkeletonSection title="Upcoming Movies" />
            <SkeletonSection title="Action Hits" />
          </>
        ) : (
          <>
            <MovieSection
              title="Trending This Week"
              icon={<FireFilled style={{ color: "#e50914" }} />}
              items={trending}
              navigate={navigate}
            />

            <MovieSection
              title="Upcoming Movies"
              fetchFn={tmdb.getUpcoming}
              navigate={navigate}
              icon={<ClockCircleOutlined style={{ color: "#e50914" }} />}
            />

            <MovieSection
              title="Action Hits"
              fetchFn={() => tmdb.getMoviesByGenre(28)}
              navigate={navigate}
              viewAll="/movies?genre=28"
              viewAllLabel="Explore Action"
            />

            <MovieSection
              title="Binge-worthy Series"
              fetchFn={tmdb.getPopularSeries}
              navigate={navigate}
              icon={<ThunderboltFilled style={{ color: "#e50914" }} />}
              viewAll="/series"
              viewAllLabel="Explore All"
            />

            <MovieSection
              title="Comedy Special"
              fetchFn={() => tmdb.getMoviesByGenre(35)}
              navigate={navigate}
              viewAll="/movies?genre=35"
              viewAllLabel="Explore Comedy"
            />

            <MovieSection
              title="Animation Favorites"
              fetchFn={() => tmdb.getMoviesByGenre(16)}
              navigate={navigate}
              icon={<RiseOutlined style={{ color: "#e50914" }} />}
            />

            <MovieSection
              title="Popular Movies"
              fetchFn={tmdb.getPopularMovies}
              navigate={navigate}
              viewAll="/movies"
              viewAllLabel="View All"
            />

            <MovieSection
              title="Sci-Fi & Fantasy"
              fetchFn={() => tmdb.getMoviesByGenre(878)}
              navigate={navigate}
              icon={<ThunderboltFilled style={{ color: "#1890ff" }} />}
            />

            <MovieSection
              title="Documentaries"
              fetchFn={() => tmdb.getMoviesByGenre(99)}
              navigate={navigate}
            />

            <MovieSection
              title="Horror Zone"
              fetchFn={() => tmdb.getMoviesByGenre(27)}
              navigate={navigate}
              icon={<FireFilled style={{ color: "#ff4d4f" }} />}
            />
          </>
        )}
      </div>

      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerUrl={trailerUrl}
        title={featured?.title}
      />
    </div>
  );
}

