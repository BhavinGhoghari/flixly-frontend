import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { AuthProvider, useAuth } from './context/AuthContext';

// User pages
import LoginPage       from './pages/LoginPage';
import HomePage        from './pages/user/HomePage';
import MoviesPage      from './pages/user/MoviesPage';
import SeriesPage      from './pages/user/SeriesPage';
import MovieDetailPage from './pages/user/MovieDetailPage';
import AllCastPage     from './pages/user/AllCastPage';
import ActorPage       from './pages/user/ActorPage';
import UserLayout      from './components/UserLayout';

// Admin pages
import AdminLayout    from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies    from './pages/admin/AdminMovies';
import AdminUsers     from './pages/admin/AdminUsers';
import AdminReviews   from './pages/admin/AdminReviews';

import './App.css';

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  if (!adminOnly && user.role === 'admin') return <Navigate to="/admin" />;
  return children;
};

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="app-loader">
      <div className="loader-logo">FLIXLY</div>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role==='admin'?'/admin':'/'} /> : <LoginPage />} />

      {/* User Routes */}
      <Route path="/" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
        <Route index element={<HomePage />} />
        <Route path="movies" element={<MoviesPage />} />
        <Route path="series" element={<SeriesPage />} />
        <Route path="movie/:id" element={<MovieDetailPage />} />
        <Route path="cast/:mediaType/:id" element={<AllCastPage />} />
        <Route path="actor/:id" element={<ActorPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="movies" element={<AdminMovies />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reviews" element={<AdminReviews />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#e50914',
          colorBgBase: '#0f0f0f',
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
