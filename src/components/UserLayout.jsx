import {
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  CloseOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { tmdb } from "../utils/api";
import { Drawer, Button, Dropdown, Avatar } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(doSearch, 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const doSearch = async () => {
    setSearching(true);
    try {
      const res = await tmdb.search(searchQuery, 1, "all");
      setSearchResults((res.data.results || []).slice(0, 8));
    } catch {}
    setSearching(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Movies", path: "/movies" },
    { label: "Series", path: "/series" },
  ];

  const userMenuItems = [
    {
      key: "profile",
      label: <span style={{ color: "#aaa" }}>{user?.name}</span>,
      disabled: true,
    },
    { type: "divider" },
    {
      key: "logout",
      label: (
        <span style={{ color: "#ff4d4f" }}>
          <LogoutOutlined /> Sign Out
        </span>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f" }}>
      <nav
        className={`flixly-nav ${scrolled ? "scrolled" : ""}`}
        style={{
          background: scrolled
            ? undefined
            : "linear-gradient(to bottom,rgba(0,0,0,0.8),transparent)",
        }}
      >
        <div className="nav-logo" onClick={() => navigate("/")}>
          FLIXLY
        </div>

        <div
          className="nav-links"
          style={{ flex: 1, justifyContent: "center" }}
        >
          {navLinks.map((l) => (
            <span
              key={l.path}
              className={`nav-link ${location.pathname === l.path ? "active" : ""}`}
              onClick={() => navigate(l.path)}
            >
              {l.label}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {searchOpen ? (
            <div style={{ position: "relative" }}>
              <Input
                ref={searchRef}
                autoFocus
                prefix={
                  searching ? (
                    <Spin size="small" />
                  ) : (
                    <SearchOutlined style={{ color: "#555" }} />
                  )
                }
                suffix={
                  <CloseOutlined
                    style={{ color: "#555", cursor: "pointer" }}
                    onClick={closeSearch}
                  />
                }
                placeholder="Search movies, series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: 280,
                  background: "#1a1a1a",
                  border: "1px solid #333",
                }}
              />
              {/* Dropdown results */}
              {searchResults.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: 8,
                    zIndex: 9999,
                    maxHeight: 400,
                    overflowY: "auto",
                    marginTop: 4,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
                  }}
                >
                  {searchResults.map((item) => (
                    <div
                      key={item.tmdbId}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "8px 12px",
                        cursor: "pointer",
                        borderBottom: "1px solid #1f1f1f",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#242424")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                      onClick={() => {
                        navigate(`/movie/${item.tmdbId}?type=${item.type}`);
                        closeSearch();
                      }}
                    >
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        style={{
                          width: 36,
                          height: 54,
                          objectFit: "cover",
                          borderRadius: 4,
                          flexShrink: 0,
                        }}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.title}
                        </div>
                        <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                          <span
                            className="badge-type"
                            style={{ fontSize: "0.6rem" }}
                          >
                            {item.type}
                          </span>
                          {item.releaseYear && (
                            <span
                              style={{ color: "#555", fontSize: "0.75rem" }}
                            >
                              {item.releaseYear}
                            </span>
                          )}
                          {item.rating > 0 && (
                            <span
                              style={{ color: "#01d277", fontSize: "0.75rem" }}
                            >
                              ★ {item.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <SearchOutlined
              style={{ color: "#ddd", fontSize: 18, cursor: "pointer" }}
              onClick={() => setSearchOpen(true)}
            />
          )}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Avatar
              style={{
                background: "#e50914",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
          </Dropdown>

          {/* Mobile Menu Toggle */}
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: "#fff", fontSize: 20 }} />}
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
            style={{ display: "none", marginLeft: 8 }}
          />
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: 2,
              color: "#e50914",
              fontSize: "1.5rem",
            }}
          >
            FLIXLY
          </span>
        }
        extra={
          <Button
            type="text"
            icon={<CloseOutlined style={{ color: "#fff", fontSize: 20 }} />}
            onClick={() => setMobileMenuOpen(false)}
          />
        }
        closable={false}
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        styles={{
          content: { background: "#0f0f0f" },
          header: { borderBottom: "1px solid #1a1a1a", background: "#0f0f0f" },
        }}
        width={280}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {navLinks.map((l) => (
            <div
              key={l.path}
              onClick={() => {
                navigate(l.path);
                setMobileMenuOpen(false);
              }}
              style={{
                color: location.pathname === l.path ? "#e50914" : "#fff",
                fontSize: "1.1rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {l.label}
            </div>
          ))}
        </div>
      </Drawer>

      <div style={{ paddingTop: 0 }}>
        <Outlet />
      </div>
    </div>
  );
}
