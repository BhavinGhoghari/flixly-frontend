import React from "react";

/**
 * A single row of metadata (icon, label, value).
 */
const DetailInfoRow = ({ icon, label, value, link, pill }) => {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: "10px 16px",
        alignItems: "flex-start",
      }}
    >
      {icon && (
        <span
          style={{
            color: "#e50914",
            fontSize: "0.8rem",
            marginTop: 2,
            flexShrink: 0,
            width: 14,
          }}
        >
          {icon}
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0, marginLeft: icon ? 0 : 24 }}>
        <div
          style={{
            color: "#555",
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        {link ? (
          <span
            onClick={link}
            style={{
              color: "#e50914",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            {value}
          </span>
        ) : pill ? (
          <span
            style={{
              background: "rgba(229,9,20,0.15)",
              border: "1px solid rgba(229,9,20,0.3)",
              color: "#e50914",
              fontSize: "0.75rem",
              padding: "2px 8px",
              borderRadius: 4,
              fontWeight: 700,
            }}
          >
            {value}
          </span>
        ) : (
          <div
            style={{
              color: "#ddd",
              fontSize: "0.85rem",
              wordBreak: "break-word",
            }}
          >
            {value}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailInfoRow;
