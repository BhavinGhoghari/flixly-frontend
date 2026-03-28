import React from "react";

/**
 * A standard section container for movie/series details.
 */
const DetailSection = ({ title, children, action }) => {
  return (
    <div style={{ marginBottom: 36 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div
          className="section-title"
          style={{ marginBottom: 0, fontSize: "1.1rem" }}
        >
          {title}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
};

export default DetailSection;
