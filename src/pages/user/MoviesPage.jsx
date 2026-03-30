import React, { useState, useEffect } from "react";
import { Input, Select, Tabs, Pagination, Empty } from "antd";
import {
  SearchOutlined,
  FireFilled,
  StarFilled,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { tmdb } from "../../utils/api";
import TMDBMovieCard from "../../components/TMDBMovieCard";
import SkeletonGrid from "../../components/SkeletonGrid";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "🔥 Most Popular" },
  { value: "vote_average.desc", label: "⭐ Top Rated" },
  { value: "release_date.desc", label: "🗓️ Newest First" },
  { value: "revenue.desc", label: "💰 Highest Grossing" },
];

export default function MoviesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "popular",
  );
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [search, setSearch] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    tmdb.getMovieGenres().then((r) => setGenres(r.data));
  }, []);
  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      fetchMovies();
    }
  }, [activeTab, page, selectedGenre, sortBy]);
  useEffect(() => {
    if (!search) return;
    const t = setTimeout(doSearch, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === "popular") res = await tmdb.getPopularMovies(page);
      else if (activeTab === "top_rated")
        res = await tmdb.getTopRatedMovies(page);
      else if (activeTab === "upcoming")
        res = await tmdb.getUpcomingMovies(page);
      else if (activeTab === "now_playing")
        res = await tmdb.getNowPlaying(page);
      else if (activeTab === "discover") {
        res = await tmdb.discoverMovies({
          page,
          sort_by: sortBy,
          with_genres: selectedGenre,
        });
      }
      const d = res.data;
      setMovies(d.results || []);
      setTotalPages(Math.min(d.total_pages || 1, 500));
      setTotalResults(d.total_results || 0);
    } catch {}
    setLoading(false);
  };

  const doSearch = async () => {
    setSearching(true);
    try {
      const res = await tmdb.search(search, 1, "movie");
      setSearchResults(res.data.results || []);
    } catch {}
    setSearching(false);
  };
  const displayList = search ? searchResults : movies;

  const tabs = [
    {
      key: "popular",
      label: (
        <>
          <FireFilled /> Popular
        </>
      ),
    },
    {
      key: "top_rated",
      label: (
        <>
          <StarFilled /> Top Rated
        </>
      ),
    },
    {
      key: "now_playing",
      label: (
        <>
          <ClockCircleOutlined /> Now Playing
        </>
      ),
    },
    {
      key: "upcoming",
      label: (
        <>
          <CalendarOutlined /> Upcoming
        </>
      ),
    },
    { key: "discover", label: "🔍 Discover" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", paddingTop: 80 }}>
      {/* Header */}
      <div
        className="page-header"
        style={{
          background: "linear-gradient(135deg,#1a0a0a 0%,#0f0f0f 100%)",
          padding: "40px 40px 0",
        }}
      >
        <h1
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(2rem,6vw,3.5rem)",
            color: "#fff",
            letterSpacing: 4,
            marginBottom: 8,
          }}
        >
          MOVIES
        </h1>

        <div
          style={{
            width: 60,
            height: 4,
            background: "#e50914",
            borderRadius: 2,
            marginBottom: 20,
          }}
        />

        <Tabs
          activeKey={activeTab}
          onChange={(k) => {
            setActiveTab(k);
            setPage(1);
          }}
          items={tabs}
          style={{ marginBottom: 0 }}
        />
      </div>

      <div
        className="page-container"
        style={{ padding: "20px 40px", maxWidth: 1400, margin: "0 auto" }}
      >
        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <Input
            className="search-input-responsive"
            prefix={<SearchOutlined style={{ color: "#555" }} />}
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{
              width: 260,
              background: "#1a1a1a",
              border: "1px solid #333",
            }}
            size="large"
          />

          {activeTab === "discover" && (
            <>
              <Select
                placeholder="Genre"
                value={selectedGenre || undefined}
                onChange={(v) => {
                  setSelectedGenre(v || "");
                  setPage(1);
                }}
                allowClear
                style={{ width: 160 }}
                size="large"
              >
                {genres.map((g) => (
                  <Select.Option key={g.id} value={g.id}>
                    {g.name}
                  </Select.Option>
                ))}
              </Select>
              <Select
                value={sortBy}
                onChange={(v) => {
                  setSortBy(v);
                  setPage(1);
                }}
                style={{ width: 200 }}
                size="large"
              >
                {SORT_OPTIONS.map((o) => (
                  <Select.Option key={o.value} value={o.value}>
                    {o.label}
                  </Select.Option>
                ))}
              </Select>
            </>
          )}
        </div>

        {!search && (
          <div style={{ color: "#555", fontSize: "0.8rem", marginBottom: 16 }}>
            {totalResults.toLocaleString()} movies found
          </div>
        )}

        {loading || searching ? (
          <SkeletonGrid count={12} />
        ) : displayList.length === 0 ? (
          <Empty
            description={<span style={{ color: "#555" }}>No movies found</span>}
            style={{ padding: "60px 0" }}
          />
        ) : (
          <>
            <div className="movies-grid">
              {displayList.map((m) => (
                <TMDBMovieCard
                  key={m.tmdbId}
                  movie={m}
                  onClick={() => navigate(`/movie/${m.tmdbId}?type=movie`)}
                />
              ))}
            </div>
            {!search && totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 40,
                }}
              >
                <Pagination
                  current={page}
                  total={Math.min(totalResults, 10000)}
                  pageSize={20}
                  onChange={(p) => {
                    setPage(p);
                    window.scrollTo(0, 0);
                  }}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
