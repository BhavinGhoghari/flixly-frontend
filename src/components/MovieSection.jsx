import React, { useRef, useState, useEffect } from "react";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import TMDBMovieCard from "./TMDBMovieCard";
import SkeletonSection from "./SkeletonSection";

/**
 * A horizontal scrolling carousel section that lazy-fetches data when in view.
 */
const MovieSection = ({ title, fetchFn, items: initialItems, navigate, viewAll, viewAllLabel, icon }) => {
  const [items, setItems] = useState(initialItems || []);
  const [loading, setLoading] = useState(!initialItems);
  const [hasFetched, setHasFetched] = useState(!!initialItems);
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
      setLoading(false);
      setHasFetched(true);
    }
  }, [initialItems]);

  useEffect(() => {
    if (hasFetched || !fetchFn) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadData();
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "200px" } // Start loading 200px before it enters
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [fetchFn, hasFetched]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchFn();
      setItems(res.data.results || []);
    } catch (err) {
      console.error(`Error loading section ${title}:`, err);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

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

  if (loading && !hasFetched) {
    return <div ref={sectionRef}><SkeletonSection title={title} /></div>;
  }

  if (hasFetched && items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
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
              onClick={() => navigate(m.type === 'series' ? `/series/${m.tmdbId}` : `/movie/${m.tmdbId}`)}
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
