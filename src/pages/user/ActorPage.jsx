import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tabs, Spin, Tag, Modal, Empty } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  StarFilled,
  VideoCameraOutlined,
  DesktopOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";
import { tmdb } from "../../utils/api";
import TMDBMovieCard from "../../components/TMDBMovieCard";

export default function ActorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("movies");
  const [bioExpanded, setBioExpanded] = useState(false);
  const [photoModal, setPhotoModal] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchActor();
  }, [id]);

  const fetchActor = async () => {
    setLoading(true);
    try {
      const res = await tmdb.getActor(id);
      setActor(res.data);
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
  if (!actor) return null;

  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=1a1a1a&color=e50914&size=342&bold=true`;
  const BIO_LIMIT = 500;
  const bioShort = actor.biography?.slice(0, BIO_LIMIT);
  const hasBioMore = actor.biography?.length > BIO_LIMIT;

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh" }}>
      {/* ── HERO BG ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          opacity: 0.04,
          backgroundImage: actor.profileUrlLg
            ? `url(${actor.profileUrlLg})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px)",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, paddingTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid #2a2a2a",
              color: "#fff",
              marginBottom: 32,
              borderRadius: 8,
            }}
          >
            Back
          </Button>

          {/* ── ACTOR HEADER ── */}
          <div
            className="actor-header-row"
            style={{
              display: "flex",
              gap: 36,
              marginBottom: 48,
              flexWrap: "wrap",
            }}
          >
            {/* Profile image */}
            <div style={{ flexShrink: 0 }} className="actor-profile-side">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 220,
                  margin: "0 auto",
                }}
              >
                <img
                  src={actor.profileUrlLg || fallback}
                  alt={actor.name}
                  onError={(e) => {
                    e.target.src = fallback;
                  }}
                  style={{
                    width: "100%",
                    aspectRatio: "2/3",
                    objectFit: "cover",
                    borderRadius: 16,
                    border: "3px solid #2a2a2a",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                    display: "block",
                  }}
                />
                {/* Popularity badge */}
                {actor.popularity > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "rgba(0,0,0,0.8)",
                      border: "1px solid #333",
                      borderRadius: 8,
                      padding: "4px 8px",
                      fontSize: "0.72rem",
                      color: "#f5c518",
                      fontWeight: 700,
                    }}
                  >
                    ★ {actor.popularity?.toFixed(1)}
                  </div>
                )}
              </div>

              {/* Quick facts under poster */}
              <div
                className="actor-facts-list"
                style={{
                  marginTop: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {actor.birthday && (
                  <div
                    style={{
                      display: "flex",
                      gap: 7,
                      alignItems: "flex-start",
                    }}
                  >
                    <CalendarOutlined
                      style={{ color: "#e50914", fontSize: 13, marginTop: 2 }}
                    />
                    <div>
                      <div
                        style={{
                          color: "#555",
                          fontSize: "0.64rem",
                          letterSpacing: 1,
                          textTransform: "uppercase",
                        }}
                      >
                        Born
                      </div>
                      <div style={{ color: "#ccc", fontSize: "0.82rem" }}>
                        {actor.birthday}
                      </div>
                      {actor.age && !actor.deathday && (
                        <div style={{ color: "#777", fontSize: "0.75rem" }}>
                          Age {actor.age}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {actor.deathday && (
                  <div
                    style={{
                      display: "flex",
                      gap: 7,
                      alignItems: "flex-start",
                    }}
                  >
                    <CalendarOutlined
                      style={{ color: "#666", fontSize: 13, marginTop: 2 }}
                    />
                    <div>
                      <div
                        style={{
                          color: "#555",
                          fontSize: "0.64rem",
                          letterSpacing: 1,
                          textTransform: "uppercase",
                        }}
                      >
                        Died
                      </div>
                      <div style={{ color: "#aaa", fontSize: "0.82rem" }}>
                        {actor.deathday}
                      </div>
                      {actor.age && (
                        <div style={{ color: "#666", fontSize: "0.75rem" }}>
                          Age {actor.age}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {actor.placeOfBirth && (
                  <div
                    style={{
                      display: "flex",
                      gap: 7,
                      alignItems: "flex-start",
                    }}
                  >
                    <EnvironmentOutlined
                      style={{ color: "#e50914", fontSize: 13, marginTop: 2 }}
                    />
                    <div>
                      <div
                        style={{
                          color: "#555",
                          fontSize: "0.64rem",
                          letterSpacing: 1,
                          textTransform: "uppercase",
                        }}
                      >
                        Birthplace
                      </div>
                      <div
                        style={{
                          color: "#ccc",
                          fontSize: "0.82rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {actor.placeOfBirth}
                      </div>
                    </div>
                  </div>
                )}
                {actor.gender && (
                  <div>
                    <div
                      style={{
                        color: "#555",
                        fontSize: "0.64rem",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      Gender
                    </div>
                    <div style={{ color: "#ccc", fontSize: "0.82rem" }}>
                      {actor.gender}
                    </div>
                  </div>
                )}
                {actor.knownFor && (
                  <div>
                    <div
                      style={{
                        color: "#555",
                        fontSize: "0.64rem",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      Known For
                    </div>
                    <Tag
                      style={{
                        background: "rgba(229,9,20,0.15)",
                        border: "1px solid rgba(229,9,20,0.3)",
                        color: "#e50914",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    >
                      {actor.knownFor}
                    </Tag>
                  </div>
                )}
                {actor.imdbId && (
                  <a
                    href={`https://www.imdb.com/name/${actor.imdbId}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#f5c518",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 4,
                    }}
                  >
                    <StarFilled style={{ fontSize: 11 }} /> IMDb Profile
                  </a>
                )}
              </div>
            </div>

            {/* Right info */}
            <div style={{ flex: 1, minWidth: 280 }} className="actor-info-main">
              <h1
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: "clamp(2.2rem,6vw,3.8rem)",
                  color: "#fff",
                  letterSpacing: 3,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {actor.name}
              </h1>

              {/* Stats row */}
              <div
                className="actor-stats-row"
                style={{
                  display: "flex",
                  gap: 16,
                  marginBottom: 24,
                  flexWrap: "wrap",
                }}
              >
                <StatChip
                  icon={<VideoCameraOutlined />}
                  label="Movies"
                  value={actor.totalMovies}
                />
                <StatChip
                  icon={<DesktopOutlined />}
                  label="TV Shows"
                  value={actor.totalTV}
                />
              </div>

              {/* Also known as */}
              {actor.alsoKnownAs?.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div
                    style={{
                      color: "#555",
                      fontSize: "0.68rem",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    Also Known As
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {actor.alsoKnownAs.slice(0, 6).map((n, i) => (
                      <Tag
                        key={i}
                        style={{
                          background: "#1a1a1a",
                          border: "1px solid #2a2a2a",
                          color: "#888",
                          fontSize: "0.75rem",
                        }}
                      >
                        {n}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {/* Biography */}
              {actor.biography && (
                <div>
                  <div
                    style={{
                      color: "#555",
                      fontSize: "0.68rem",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    Biography
                  </div>
                  <p
                    style={{
                      color: "#bbb",
                      lineHeight: 1.85,
                      fontSize: "0.9rem",
                      margin: 0,
                    }}
                  >
                    {bioExpanded ? actor.biography : bioShort}
                    {hasBioMore && !bioExpanded && "..."}
                  </p>
                  {hasBioMore && (
                    <Button
                      type="text"
                      size="small"
                      onClick={() => setBioExpanded(!bioExpanded)}
                      style={{
                        color: "#e50914",
                        padding: "8px 0",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                      }}
                    >
                      {bioExpanded ? "Show Less ▲" : "Read More ▼"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── PHOTOS ── */}
          {actor.photos?.length > 0 && (
            <div style={{ marginBottom: 48 }}>
              <div className="section-title" style={{ marginBottom: 16 }}>
                Photos
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  overflowX: "auto",
                  paddingBottom: 8,
                }}
              >
                {actor.photos.map((ph, i) => (
                  <div
                    key={i}
                    onClick={() => setPhotoModal(ph.urlLg)}
                    style={{
                      flexShrink: 0,
                      width: 100,
                      borderRadius: 10,
                      overflow: "hidden",
                      cursor: "pointer",
                      border: "2px solid #1f1f1f",
                      position: "relative",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.04)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <img
                      src={ph.url}
                      alt={`${actor.name} photo ${i + 1}`}
                      style={{
                        width: "100%",
                        aspectRatio: "2/3",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(0,0,0,0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(0,0,0,0)";
                      }}
                    >
                      <ZoomInOutlined
                        style={{ color: "#fff", fontSize: 18, opacity: 0 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FILMOGRAPHY TABS ── */}
          <div style={{ marginBottom: 16 }}>
            <div className="section-title" style={{ marginBottom: 20 }}>
              Filmography
            </div>
            <Tabs
              activeKey={tab}
              onChange={setTab}
              items={[
                {
                  key: "movies",
                  label: (
                    <>
                      <VideoCameraOutlined /> Movies (
                      {actor.movieCredits?.length || 0})
                    </>
                  ),
                },
                {
                  key: "series",
                  label: (
                    <>
                      <DesktopOutlined /> Series ({actor.tvCredits?.length || 0}
                      )
                    </>
                  ),
                },
              ]}
              style={{ marginBottom: 24 }}
            />
          </div>

          {tab === "movies" ? (
            actor.movieCredits?.length === 0 ? (
              <Empty
                description={
                  <span style={{ color: "#555" }}>No movie credits found</span>
                }
              />
            ) : (
              <div className="movies-grid" style={{ paddingBottom: 60 }}>
                {actor.movieCredits.map((m) => (
                  <div key={m.tmdbId} style={{ position: "relative" }}>
                    <TMDBMovieCard
                      movie={m}
                      onClick={() => navigate(`/movie/${m.tmdbId}?type=movie`)}
                    />
                    {m.role && (
                      <div
                        style={{
                          padding: "5px 6px 0",
                          fontSize: "0.7rem",
                          color: "#666",
                          fontStyle: "italic",
                          lineHeight: 1.3,
                        }}
                      >
                        as {m.role}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : actor.tvCredits?.length === 0 ? (
            <Empty
              description={
                <span style={{ color: "#555" }}>No TV credits found</span>
              }
            />
          ) : (
            <div className="movies-grid" style={{ paddingBottom: 60 }}>
              {actor.tvCredits.map((m) => (
                <div key={m.tmdbId} style={{ position: "relative" }}>
                  <TMDBMovieCard
                    movie={m}
                    onClick={() => navigate(`/movie/${m.tmdbId}?type=series`)}
                  />
                  {m.role && (
                    <div
                      style={{
                        padding: "5px 6px 0",
                        fontSize: "0.7rem",
                        color: "#666",
                        fontStyle: "italic",
                        lineHeight: 1.3,
                      }}
                    >
                      as {m.role}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Photo modal */}
      <Modal
        open={!!photoModal}
        onCancel={() => setPhotoModal(null)}
        footer={null}
        centered
        width="auto"
        style={{ maxWidth: "90vw" }}
        styles={{
          content: {
            background: "#000",
            padding: 0,
            borderRadius: 12,
            overflow: "hidden",
          },
          body: { padding: 0 },
        }}
      >
        {photoModal && (
          <img
            src={photoModal}
            alt={actor.name}
            style={{
              maxWidth: "85vw",
              maxHeight: "85vh",
              display: "block",
              objectFit: "contain",
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function StatChip({ icon, label, value }) {
  return (
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
      <span style={{ color: "#e50914", fontSize: 16 }}>{icon}</span>
      <div>
        <div
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "1.4rem",
            color: "#fff",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            color: "#555",
            fontSize: "0.65rem",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
