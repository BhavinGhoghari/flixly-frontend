import React from "react";
import { Tooltip } from "antd";
import { DesktopOutlined } from "@ant-design/icons";

/**
 * Small chip for displaying a streaming provider.
 */
const ProviderChip = ({ provider }) => {
  return (
    <Tooltip title={provider.name}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          background: "#1a1a1a",
          border: "1px solid #252525",
          borderRadius: 8,
          padding: "6px 10px",
          cursor: "default",
        }}
      >
        {provider.logoUrl ? (
          <img
            src={provider.logoUrl}
            alt={provider.name}
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              objectFit: "cover",
            }}
            onError={(e) => (e.target.style.display = "none")}
            loading="lazy"
          />
        ) : (
          <DesktopOutlined style={{ color: "#555", fontSize: 16 }} />
        )}
        <span
          style={{
            color: "#ccc",
            fontSize: "0.78rem",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {provider.name}
        </span>
      </div>
    </Tooltip>
  );
};

export default ProviderChip;
