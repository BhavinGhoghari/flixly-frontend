import React from "react";
import { Skeleton } from "antd";

const SkeletonCard = () => (
  <div
    className="movie-card"
    style={{ background: "#1a1a1a" }}
  >
    <Skeleton.Button active style={{ width: "100%", height: "100%" }} />
  </div>
);

export default function SkeletonSection({ title }) {
  return (
    <section className="section-container" style={{ marginBottom: 52 }}>
      <div style={{ marginBottom: 20 }}>
        <Skeleton active title={{ width: 150 }} paragraph={false} />
      </div>
      <div className="movies-carousel" style={{ overflow: "hidden" }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}
