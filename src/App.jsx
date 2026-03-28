import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { AuthProvider, useAuth } from "./context/AuthContext";

// User pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const HomePage = lazy(() => import("./pages/user/HomePage"));
const MoviesPage = lazy(() => import("./pages/user/MoviesPage"));
const SeriesPage = lazy(() => import("./pages/user/SeriesPage"));
const MovieDetailPage = lazy(() => import("./pages/user/MovieDetailPage"));
const AllCastPage = lazy(() => import("./pages/user/AllCastPage"));
const ActorPage = lazy(() => import("./pages/user/ActorPage"));
const UserLayout = lazy(() => import("./components/UserLayout"));

// Admin pages
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminMovies = lazy(() => import("./pages/admin/AdminMovies"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));

import "./App.css";

const PageLoader = () => (
  <div className="app-loader">
    <div className="loader-logo">FLIXLY</div>
  </div>
);

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" />;
  if (!adminOnly && user.role === "admin") return <Navigate to="/admin" />;
  return children;
};

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="app-loader">
        <div className="loader-logo">FLIXLY</div>
      </div>
    );

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={user.role === "admin" ? "/admin" : "/"} />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* User Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="series" element={<SeriesPage />} />
          <Route path="movie/:id" element={<MovieDetailPage />} />
          <Route path="cast/:mediaType/:id" element={<AllCastPage />} />
          <Route path="actor/:id" element={<ActorPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#e50914",
          colorBgBase: "#0f0f0f",
          borderRadius: 8,
          fontFamily: "'Montserrat', sans-serif",
        },
      }}
    >
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}
