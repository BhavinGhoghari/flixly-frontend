import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tag, Spin, Divider, Tooltip } from "antd";
import {
  PlayCircleOutlined,
  ArrowLeftOutlined,
  StarFilled,
  ClockCircleOutlined,
  CalendarOutlined,
  GlobalOutlined,
  TeamOutlined,
  TrophyOutlined,
  RightOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  TranslationOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import { tmdb } from "../../utils/api";
import TrailerModal from "../../components/TrailerModal";
import ReviewSection from "../../components/ReviewSection";
import DetailSection from "../../components/DetailSection";
import DetailInfoGroup from "../../components/DetailInfoGroup";
import DetailInfoRow from "../../components/DetailInfoRow";
import CastCard from "../../components/CastCard";
import ProviderChip from "../../components/ProviderChip";
import MovieSection from "../../components/MovieSection";

const GENRE_COLORS = {
  Action: "red",
  Comedy: "gold",
  Drama: "blue",
  Horror: "purple",
  Thriller: "orange",
  Romance: "pink",
  "Science Fiction": "cyan",
  Fantasy: "geekblue",
  Animation: "lime",
  Documentary: "green",
  Adventure: "volcano",
  Crime: "magenta",
  Mystery: "purple",
  History: "brown",
  Music: "orange",
  Western: "gold",
  War: "red",
  Family: "green",
};

const fmtMoney = (n) => (n > 0 ? `$${(n / 1e6).toFixed(1)}M` : "N/A");

export default function SeriesDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const type = "series";

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    setLoading(true);
    try {
      const res = await tmdb.getSeriesDetail(id);
      setMovie(res.data);
    } catch {
      navigate("/");
    }
    setLoading(false);
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0f0f0f",
        }}
      >
        <div
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "2rem",
            color: "#e50914",
            letterSpacing: 6,
          }}
        >
          FLIXLY
        </div>
        <Spin size="large" />
      </div>
    );
  if (!movie) return null;

  const hasProviders =
    movie.watchProviders &&
    (movie.watchProviders.flatrate?.length ||
      movie.watchProviders.rent?.length ||
      movie.watchProviders.buy?.length);

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh" }}>
      <div
        style={{
          position: "relative",
          height: "clamp(280px,52vh,580px)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: "brightness(0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top,#0f0f0f 0%,rgba(15,15,15,0.3) 55%,transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right,rgba(15,15,15,0.85) 0%,transparent 75%)",
          }}
        />
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="back-button"
          style={{
            position: "absolute",
            top: 90,
            left: 28,
            background: "rgba(0,0,0,0.65)",
            border: "1px solid #333",
            color: "#fff",
            borderRadius: 8,
          }}
        >
          Back
        </Button>
      </div>

      <div
        style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}
        className="detail-container"
      >
        <div
          className="detail-main-row"
          style={{
            display: "flex",
            gap: 32,
            marginTop: -130,
            position: "relative",
            zIndex: 2,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div style={{ flexShrink: 0 }} className="detail-poster">
            <img
              src={
                movie.posterUrl ||
                `https://placehold.co/260x390/1a1a1a/e50914?text=${encodeURIComponent(movie.title)}`
              }
              alt={movie.title}
              onError={(e) => {
                e.target.src = `https://placehold.co/260x390/1a1a1a/e50914?text=${encodeURIComponent(movie.title)}`;
              }}
              style={{
                width: "100%",
                aspectRatio: "2/3",
                objectFit: "cover",
                borderRadius: 14,
                border: "3px solid #2a2a2a",
                boxShadow: "0 24px 64px rgba(0,0,0,0.9)",
              }}
            />
          </div>

          <div
            className="detail-info"
            style={{ flex: 1, minWidth: 260, paddingBottom: 8, paddingTop: 60 }}
          >
            <div
              className="detail-info-badges"
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 10,
              }}
            >
              <span className="badge-type">{movie.type}</span>
              {movie.ageRating && (
                <span
                  style={{
                    border: "1px solid #555",
                    color: "#999",
                    fontSize: "0.68rem",
                    padding: "2px 7px",
                    borderRadius: 4,
                    fontWeight: 700,
                  }}
                >
                  {movie.ageRating}
                </span>
              )}
              {movie.airStatus && (
                <span
                  style={{
                    border: "1px solid #2a6a2a",
                    color: "#52c41a",
                    fontSize: "0.68rem",
                    padding: "2px 7px",
                    borderRadius: 4,
                  }}
                >
                  {movie.airStatus}
                </span>
              )}
              {movie.tagline && (
                <span
                  style={{
                    color: "#555",
                    fontStyle: "italic",
                    fontSize: "0.8rem",
                  }}
                >
                  "{movie.tagline}"
                </span>
              )}
            </div>

            <h1
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(1.9rem,5vw,3.2rem)",
                color: "#fff",
                letterSpacing: 2,
                lineHeight: 1.05,
                marginBottom: 6,
              }}
            >
              {movie.title}
            </h1>
            {movie.originalTitle && (
              <div
                style={{ color: "#555", fontSize: "0.82rem", marginBottom: 10 }}
              >
                Original: {movie.originalTitle}
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 14,
              }}
            >
              {movie.genre?.map((g) => (
                <Tag
                  key={g}
                  color={GENRE_COLORS[g] || "default"}
                  style={{ fontSize: "0.73rem" }}
                >
                  {g}
                </Tag>
              ))}
            </div>

            <div
              className="detail-info-rating"
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 18,
                flexWrap: "wrap",
              }}
            >
              {movie.rating > 0 && (
                <div
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: 10,
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <StarFilled style={{ color: "#01d277", fontSize: 20 }} />
                  <div>
                    <div
                      style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: "1.5rem",
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {movie.rating}
                      <span style={{ color: "#555", fontSize: "0.8rem" }}>
                        /10
                      </span>
                    </div>
                    <div
                      style={{
                        color: "#555",
                        fontSize: "0.68rem",
                        letterSpacing: 1,
                      }}
                    >
                      TMDB · {(movie.voteCount || 0).toLocaleString()} votes
                    </div>
                  </div>
                </div>
              )}

              {movie.totalReviews > 0 && (
                <div
                  style={{
                    background: "linear-gradient(135deg, #1a0a0a, #1a1a1a)",
                    border: "1px solid #441111",
                    borderRadius: 10,
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <StarFilled style={{ color: "#e50914", fontSize: 20 }} />
                  <div>
                    <div
                      style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: "1.5rem",
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {movie.averageUserRating}
                      <span style={{ color: "#555", fontSize: "0.8rem" }}>
                        /10
                      </span>
                    </div>
                    <div
                      style={{
                        color: "#e50914",
                        fontSize: "0.68rem",
                        letterSpacing: 1,
                        fontWeight: 700,
                      }}
                    >
                      COMMUNITY · {movie.totalReviews} reviews
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className="detail-info-actions"
              style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
            >
              {movie.trailerUrl && (
                <Button
                  type="primary"
                  danger
                  size="large"
                  icon={<PlayCircleOutlined />}
                  onClick={() => setTrailerOpen(true)}
                  style={{
                    fontWeight: 700,
                    letterSpacing: 1,
                    height: 46,
                    paddingInline: 24,
                  }}
                >
                  WATCH TRAILER
                </Button>
              )}
            </div>
          </div>
        </div>

        <div
          className="detail-sidebar-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: 36,
            marginTop: 44,
            alignItems: "start",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <DetailSection title="Synopsis">
              <p
                style={{
                  color: "#ccc",
                  lineHeight: 1.85,
                  fontSize: "0.95rem",
                  margin: 0,
                }}
              >
                {movie.description || "No description available."}
              </p>
            </DetailSection>

            {movie.cast?.length > 0 && (
              <DetailSection
                title="Cast"
                action={
                  <Button
                    size="small"
                    type="text"
                    style={{
                      color: "#e50914",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                    }}
                    onClick={() => navigate(`/cast/${type}/${id}`)}
                    icon={<RightOutlined />}
                    iconPosition="end"
                  >
                    View All {movie.allCast?.length} Cast & Crew
                  </Button>
                }
              >
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    overflowX: "auto",
                    paddingBottom: 8,
                  }}
                >
                  {movie.cast.map((c) => (
                    <CastCard
                      key={c.id}
                      cast={c}
                      onClick={() => navigate(`/actor/${c.id}`)}
                    />
                  ))}
                  {movie.allCast?.length > 12 && (
                    <div
                      onClick={() => navigate(`/cast/${type}/${id}`)}
                      style={{
                        flexShrink: 0,
                        width: 110,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#1a1a1a",
                        border: "1px dashed #333",
                        borderRadius: 10,
                        padding: 12,
                        gap: 6,
                        minHeight: 170,
                      }}
                    >
                      <RightOutlined
                        style={{ color: "#e50914", fontSize: 24 }}
                      />
                      <span
                        style={{
                          color: "#aaa",
                          fontSize: "0.75rem",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        All Cast & Crew
                      </span>
                    </div>
                  )}
                </div>
              </DetailSection>
            )}

            {movie.keywords?.length > 0 && (
              <DetailSection title="Keywords">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {movie.keywords.slice(0, 20).map((k) => (
                    <Tag
                      key={k}
                      style={{
                        background: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                        color: "#777",
                        borderRadius: 20,
                        fontSize: "0.72rem",
                      }}
                    >
                      #{k}
                    </Tag>
                  ))}
                </div>
              </DetailSection>
            )}

            {hasProviders && (
              <DetailSection
                title={
                  <>
                    <DesktopOutlined style={{ marginRight: 8 }} />
                    Where to Watch
                  </>
                }
              >
                {movie.watchProviders.flatrate?.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        color: "#666",
                        fontSize: "0.7rem",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}
                    >
                      Stream
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {movie.watchProviders.flatrate.map((p) => (
                        <ProviderChip key={p.name} provider={p} />
                      ))}
                    </div>
                  </div>
                )}
                {movie.watchProviders.rent?.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        color: "#666",
                        fontSize: "0.7rem",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}
                    >
                      Rent
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {movie.watchProviders.rent.map((p) => (
                        <ProviderChip key={p.name} provider={p} />
                      ))}
                    </div>
                  </div>
                )}
                {movie.watchProviders.buy?.length > 0 && (
                  <div>
                    <div
                      style={{
                        color: "#666",
                        fontSize: "0.7rem",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}
                    >
                      Buy
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {movie.watchProviders.buy.map((p) => (
                        <ProviderChip key={p.name} provider={p} />
                      ))}
                    </div>
                  </div>
                )}
              </DetailSection>
            )}

            <Divider style={{ borderColor: "#1f1f1f", margin: "32px 0" }} />

            <DetailSection
              title={
                <>
                  <TrophyOutlined style={{ marginRight: 8 }} />
                  Community Reviews
                </>
              }
            >
              <ReviewSection movieId={`tmdb_series_${id}`} />
            </DetailSection>
          </div>

          <div style={{ position: "sticky", top: 85 }}>
            <div
              style={{
                background: "#131313",
                border: "1px solid #222",
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg,#1a0a0a,#1a1a1a)",
                  padding: "14px 18px",
                  borderBottom: "1px solid #222",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: "#fff",
                    fontSize: "0.85rem",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Details
                </div>
              </div>

              <div style={{ padding: "0" }}>
                <DetailInfoGroup>
                  <DetailInfoRow
                    icon={<CalendarOutlined />}
                    label="First Aired"
                    value={movie.releaseDate}
                  />
                  {movie.lastAirDate && (
                    <DetailInfoRow
                      icon={<CalendarOutlined />}
                      label="Last Aired"
                      value={movie.lastAirDate}
                    />
                  )}
                </DetailInfoGroup>

                <DetailInfoGroup>
                  {movie.episodeRuntime && (
                    <DetailInfoRow
                      icon={<ClockCircleOutlined />}
                      label="Episode Length"
                      value={movie.episodeRuntime}
                    />
                  )}
                  {movie.totalSeasons && (
                    <DetailInfoRow
                      icon={null}
                      label="Seasons"
                      value={`${movie.totalSeasons} Season${movie.totalSeasons > 1 ? "s" : ""}`}
                    />
                  )}
                  {movie.totalEpisodes && (
                    <DetailInfoRow
                      icon={null}
                      label="Episodes"
                      value={movie.totalEpisodes}
                    />
                  )}
                </DetailInfoGroup>

                <DetailInfoGroup>
                  <DetailInfoRow
                    icon={<span style={{ fontSize: "0.8rem" }}>🎬</span>}
                    label="Director"
                    value={movie.director}
                    link={
                      movie.directorId
                        ? () => navigate(`/actor/${movie.directorId}`)
                        : null
                    }
                  />
                  {movie.createdBy?.length > 0 && (
                    <DetailInfoRow
                      icon={null}
                      label="Created By"
                      value={movie.createdBy.map((c) => c.name).join(", ")}
                    />
                  )}
                </DetailInfoGroup>

                <DetailInfoGroup>
                  <DetailInfoRow
                    icon={<GlobalOutlined />}
                    label="Language"
                    value={movie.language}
                  />
                  {movie.country && (
                    <DetailInfoRow
                      icon={null}
                      label="Country"
                      value={movie.country}
                    />
                  )}
                </DetailInfoGroup>

                <DetailInfoGroup>
                  <DetailInfoRow
                    icon={null}
                    label="Age Rating"
                    value={movie.ageRating}
                    pill
                  />
                  {movie.airStatus && (
                    <DetailInfoRow
                      icon={null}
                      label="Air Status"
                      value={movie.airStatus}
                    />
                  )}
                </DetailInfoGroup>

                {movie.networks?.length > 0 && (
                  <DetailInfoGroup>
                    <div style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          color: "#555",
                          fontSize: "0.68rem",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          marginBottom: 8,
                        }}
                      >
                        Network
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        {movie.networks.map((n) => (
                          <div
                            key={n.name}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            {n.logoUrl ? (
                              <img
                                src={n.logoUrl}
                                alt={n.name}
                                style={{
                                  height: 22,
                                  objectFit: "contain",
                                  filter: "brightness(2)",
                                  maxWidth: 80,
                                }}
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
                              />
                            ) : (
                              <span
                                style={{
                                  color: "#ccc",
                                  fontSize: "0.82rem",
                                  fontWeight: 600,
                                }}
                              >
                                {n.name}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </DetailInfoGroup>
                )}

                {/* Budget / Revenue */}
                {(movie.budget > 0 || movie.revenue > 0) && (
                  <DetailInfoGroup>
                    {movie.budget > 0 && (
                      <DetailInfoRow
                        icon={<DollarOutlined />}
                        label="Budget"
                        value={fmtMoney(movie.budget)}
                      />
                    )}
                    {movie.revenue > 0 && (
                      <DetailInfoRow
                        icon={<DollarOutlined />}
                        label="Revenue"
                        value={fmtMoney(movie.revenue)}
                      />
                    )}
                  </DetailInfoGroup>
                )}
              </div>
            </div>

            {movie.imdbId && (
              <div style={{ padding: "12px 16px", marginTop: 12 }}>
                <a
                  href={`https://www.imdb.com/title/${movie.imdbId}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#f5c518",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <StarFilled style={{ fontSize: 12 }} /> View on IMDb
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {movie.recommendations?.length > 0 && (
        <div style={{ maxWidth: 1280, margin: "40px auto 0", padding: "0 28px" }}>
          <MovieSection
            title="More Like This"
            items={movie.recommendations}
            navigate={navigate}
          />
        </div>
      )}

      <div style={{ height: 80 }} />
      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerUrl={movie.trailerUrl}
        title={movie.title}
      />
    </div>
  );
}
