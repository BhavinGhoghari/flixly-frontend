import React from "react";

/**
 * Card for displaying a cast member.
 */
const CastCard = ({ cast, onClick }) => {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(cast.name)}&background=1a1a1a&color=e50914&size=185&bold=true`;
  return (
    <div
      onClick={onClick}
      style={{
        flexShrink: 0,
        width: 110,
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-4px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div
        style={{
          borderRadius: 10,
          overflow: "hidden",
          border: "2px solid #1f1f1f",
          marginBottom: 7,
          background: "#1a1a1a",
        }}
      >
        <img
          src={cast.profileUrl || fallback}
          alt={cast.name}
          onError={(e) => {
            e.target.src = fallback;
          }}
          style={{
            width: "100%",
            aspectRatio: "2/3",
            objectFit: "cover",
            display: "block",
          }}
          loading="lazy"
        />
      </div>
      <div
        style={{
          color: "#fff",
          fontSize: "0.78rem",
          fontWeight: 600,
          lineHeight: 1.3,
          marginBottom: 2,
        }}
      >
        {cast.name}
      </div>
      {cast.role && (
        <div style={{ color: "#666", fontSize: "0.7rem", lineHeight: 1.3 }}>
          {cast.role}
        </div>
      )}
    </div>
  );
};

export default CastCard;
