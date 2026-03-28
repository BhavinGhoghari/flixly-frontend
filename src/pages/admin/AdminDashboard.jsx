import React, { useState, useEffect } from "react";
import { Row, Col, Table, Tag, Spin } from "antd";
import {
  VideoCameraOutlined,
  TeamOutlined,
  StarOutlined,
  PlaySquareOutlined,
  FireFilled,
} from "@ant-design/icons";
import API, { tmdb } from "../../utils/api";

function StatCard({ icon, value, label, iconBg, sub }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon" style={{ background: iconBg }}>
        {icon}
      </div>
      <div>
        <div className="admin-stat-value">{value}</div>
        <div className="admin-stat-label">{label}</div>
        {sub && (
          <div style={{ color: "#555", fontSize: "0.7rem", marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentMovies, setRecentMovies] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, moviesRes, reviewsRes, trendRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/movies?limit=5"),
        API.get("/reviews/all"),
        tmdb.getTrending("day"),
      ]);
      setStats(statsRes.data);
      setRecentMovies(moviesRes.data.movies);
      setRecentReviews(reviewsRes.data.slice(0, 5));
      setTrending((trendRes.data.results || []).slice(0, 6));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );

  const movieCols = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (t, r) => (
        <div>
          <div style={{ fontWeight: 600, color: "#fff" }}>{t}</div>
          <div style={{ color: "#555", fontSize: "0.75rem" }}>
            {r.releaseYear}
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (t) => <span className="badge-type">{t}</span>,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (r) =>
        r > 0 ? (
          <span style={{ color: "#01d277", fontWeight: 700 }}>★ {r}</span>
        ) : (
          "—"
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color={s === "active" ? "green" : "red"}>{s}</Tag>,
    },
  ];

  const reviewCols = [
    {
      title: "User",
      key: "user",
      render: (_, r) => <span style={{ color: "#ddd" }}>{r.user?.name}</span>,
    },
    {
      title: "Movie",
      key: "movie",
      render: (_, r) => (
        <span style={{ color: "#aaa", fontSize: "0.85rem" }}>
          {r.movie?.title}
        </span>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (r) => (
        <span style={{ color: "#f5c518", fontWeight: 700 }}>⭐ {r}/10</span>
      ),
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      key: "verdict",
      render: (v) => {
        const map = {
          avoid: ["red", "🚫 Avoid"],
          "time-pass": ["orange", "😐 Time Pass"],
          "one-time-watch": ["gold", "👍 One-Time"],
          "go-for-it": ["green", "✅ Go For It"],
          "must-watch": ["blue", "🔥 Must Watch"],
          masterpiece: ["purple", "👑 Masterpiece"],
        };
        return <Tag color={map[v]?.[0]}>{map[v]?.[1] || v}</Tag>;
      },
    },
  ];

  const trendingCols = [
    {
      title: "",
      key: "poster",
      width: 50,
      render: (_, r) => (
        <img
          src={r.posterUrl}
          alt=""
          style={{ width: 36, height: 54, objectFit: "cover", borderRadius: 4 }}
          onError={(e) => (e.target.style.display = "none")}
        />
      ),
    },
    {
      title: "Title",
      key: "title",
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, color: "#fff", fontSize: "0.88rem" }}>
            {r.title}
          </div>
          <div style={{ color: "#555", fontSize: "0.73rem" }}>
            {r.releaseYear}
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (t) => (
        <span className="badge-type" style={{ fontSize: "0.6rem" }}>
          {t}
        </span>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (r) => (
        <span
          style={{ color: "#01d277", fontWeight: 700, fontSize: "0.85rem" }}
        >
          ★ {r}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "2rem",
            color: "#fff",
            letterSpacing: 3,
            marginBottom: 0,
          }}
        >
          DASHBOARD
        </h1>
        <p style={{ color: "#555", fontSize: "0.85rem" }}>
          Welcome back to Flixly Admin.
        </p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            icon={<VideoCameraOutlined style={{ color: "#e50914" }} />}
            value={stats?.totalMovies || 0}
            label="Movies in Library"
            iconBg="rgba(229,9,20,0.15)"
            sub="from local DB"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            icon={<PlaySquareOutlined style={{ color: "#1677ff" }} />}
            value={stats?.totalSeries || 0}
            label="Series in Library"
            iconBg="rgba(22,119,255,0.15)"
            sub="from local DB"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            icon={<TeamOutlined style={{ color: "#52c41a" }} />}
            value={stats?.totalUsers || 0}
            label="Registered Users"
            iconBg="rgba(82,196,26,0.15)"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            icon={<StarOutlined style={{ color: "#f5c518" }} />}
            value={stats?.totalReviews || 0}
            label="Total Reviews"
            iconBg="rgba(245,197,24,0.15)"
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={14}>
          <div
            style={{
              background: "#111",
              border: "1px solid #1f1f1f",
              borderRadius: 12,
              padding: "20px",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: "#fff",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FireFilled style={{ color: "#e50914" }} /> Library — Recent
              Titles
            </div>
            <Table
              dataSource={recentMovies}
              columns={movieCols}
              rowKey="_id"
              pagination={false}
              size="small"
              scroll={{ x: "max-content" }}
            />
          </div>
          <div
            style={{
              background: "#111",
              border: "1px solid #1f1f1f",
              borderRadius: 12,
              padding: "20px",
            }}
          >
            <div style={{ fontWeight: 700, color: "#fff", marginBottom: 16 }}>
              ⭐ Recent Reviews
            </div>
            <Table
              dataSource={recentReviews}
              columns={reviewCols}
              rowKey="_id"
              pagination={false}
              size="small"
              scroll={{ x: "max-content" }}
            />
          </div>
        </Col>
        <Col xs={24} xl={10}>
          <div
            style={{
              background: "#111",
              border: "1px solid #1f1f1f",
              borderRadius: 12,
              padding: "20px",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: "#fff",
                marginBottom: 4,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              🔥 Trending Today
            </div>
            <div
              style={{
                color: "#555",
                fontSize: "0.72rem",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#01d277",
                }}
              />{" "}
              Live from TMDB
            </div>
            <Table
              dataSource={trending}
              columns={trendingCols}
              rowKey="tmdbId"
              pagination={false}
              size="small"
              scroll={{ x: "max-content" }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
