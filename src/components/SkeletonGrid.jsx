import React from "react";
import { Skeleton } from "antd";

const SkeletonCard = () => (
  <div
    className="movie-card skeleton"
    style={{ background: "#1a1a1a", borderRadius: 8, overflow: "hidden" }}
  >
    <Skeleton.Button active style={{ width: "100%", height: 280 }} />
    <div style={{ padding: 12 }}>
      <Skeleton active paragraph={{ rows: 1 }} title={{ width: "60%" }} />
    </div>
  </div>
);

export default function SkeletonGrid({ count = 12 }) {
  return (
    <div className="movies-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
