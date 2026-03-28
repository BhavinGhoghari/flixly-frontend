import React, { useRef } from "react";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import TMDBMovieCard from "./TMDBMovieCard";

/**
 * A horizontal scrolling carousel section for movie items.
 */
const MovieSection = ({ title, items, navigate, viewAll, viewAllLabel, icon }) => {
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
          {icon && <span style={{ marginRight: 10 }}>{icon}</span>}
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
};

export default MovieSection;
