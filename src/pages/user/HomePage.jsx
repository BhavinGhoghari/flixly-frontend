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

export default function HomePage() {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [animationMovies, setAnimationMovies] = useState([]);
  const [scifiMovies, setScifiMovies] = useState([]);
  const [docs, setDocs] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [
        trendRes,
        popRes,
        upRes,
        popSerRes,
        actionRes,
        comedyRes,
        horrorRes,
        animRes,
        scifiRes,
        docRes,
      ] = await Promise.all([
        tmdb.getTrending("week"),
        tmdb.getPopularMovies(),
        tmdb.getUpcoming(),
        tmdb.getPopularSeries(),
        tmdb.getMoviesByGenre(28), // Action
        tmdb.getMoviesByGenre(35), // Comedy
        tmdb.getMoviesByGenre(27), // Horror
        tmdb.getMoviesByGenre(16), // Animation
        tmdb.getMoviesByGenre(878), // Sci-Fi
        tmdb.getMoviesByGenre(99), // Documentary
      ]);
      const tr = trendRes.data.results || [];
      setTrending(tr);
      setFeatured(tr[0] || null);
      setPopular(popRes.data.results || []);
      setUpcoming(upRes.data.results || []);
      setPopularSeries(popSerRes.data.results || []);
      setActionMovies(actionRes.data.results || []);
      setComedyMovies(comedyRes.data.results || []);
      setHorrorMovies(horrorRes.data.results || []);
      setAnimationMovies(animRes.data.results || []);
      setScifiMovies(scifiRes.data.results || []);
      setDocs(docRes.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0f0f0f",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "2.5rem",
            color: "#e50914",
            letterSpacing: 8,
          }}
        >
          FLIXLY
        </div>
        <Spin size="large" />
        <div style={{ color: "#444", fontSize: "0.85rem" }}>
          Loading from TMDB...
        </div>
      </div>
    );

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh" }}>
      {/* ── HERO ── */}
      {featured && (
        <div className="hero-section">
          <div
            className="hero-bg"
            style={{
              backgroundImage: `url(${featured.backdropUrl || featured.posterUrl})`,
            }}
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
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
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
      )}

      <div
        className="home-container"
        style={{
          padding: "40px 60px",
          maxWidth: 1800,
          margin: "0 auto",
          // marginTop: "-80px",
          position: "relative",
          zIndex: 5,
        }}
      >
        <Section
          title="Trending This Week"
          icon={<FireFilled style={{ color: "#e50914" }} />}
          items={trending}
          navigate={navigate}
        />

        <Section
          title="Upcoming Movies"
          items={upcoming}
          navigate={navigate}
          icon={<ClockCircleOutlined style={{ color: "#e50914" }} />}
        />

        <Section
          title="Action Hits"
          items={actionMovies}
          navigate={navigate}
          viewAll="/movies?genre=28"
          viewAllLabel="Explore Action"
        />

        <Section
          title="Binge-worthy Series"
          items={popularSeries}
          navigate={navigate}
          icon={<ThunderboltFilled style={{ color: "#e50914" }} />}
          viewAll="/series"
          viewAllLabel="Explore All"
        />

        <Section
          title="Comedy Special"
          items={comedyMovies}
          navigate={navigate}
          viewAll="/movies?genre=35"
          viewAllLabel="Explore Comedy"
        />

        <Section
          title="Animation Favorites"
          items={animationMovies}
          navigate={navigate}
          icon={<RiseOutlined style={{ color: "#e50914" }} />}
        />

        <Section
          title="Popular Movies"
          items={popular}
          navigate={navigate}
          viewAll="/movies"
          viewAllLabel="View All"
        />

        <Section
          title="Sci-Fi & Fantasy"
          items={scifiMovies}
          navigate={navigate}
          icon={<ThunderboltFilled style={{ color: "#1890ff" }} />}
        />

        <Section title="Documentaries" items={docs} navigate={navigate} />

        <Section
          title="Horror Zone"
          items={horrorMovies}
          navigate={navigate}
          icon={<FireFilled style={{ color: "#ff4d4f" }} />}
        />
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

function Section({ title, items, navigate, viewAll, viewAllLabel, icon }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth * 0.8
          : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section
      className="section-container"
      style={{ marginBottom: 52, position: "relative" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div className="section-title" style={{ marginBottom: 0 }}>
          {title}
        </div>
        {viewAll && (
          <span
            style={{
              color: "#e50914",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
            onClick={() => navigate(viewAll)}
          >
            {viewAllLabel} →
          </span>
        )}
      </div>

      <div style={{ position: "relative" }} className="carousel-wrapper">
        <Button
          className="carousel-btn left"
          icon={<LeftOutlined />}
          onClick={() => scroll("left")}
        />

        <div className="movies-carousel" ref={scrollRef}>
          {items.map((m) => (
            <TMDBMovieCard
              key={m.tmdbId}
              movie={m}
              onClick={() => navigate(`/movie/${m.tmdbId}?type=${m.type}`)}
            />
          ))}
        </div>

        <Button
          className="carousel-btn right"
          icon={<RightOutlined />}
          onClick={() => scroll("right")}
        />
      </div>
    </section>
  );
}
