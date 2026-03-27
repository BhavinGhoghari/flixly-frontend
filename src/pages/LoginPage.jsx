import React, { useState } from 'react';
import { Form, Input, Button, Tabs, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = async (values) => {
    setLoading(true);
    setError('');
    try {
      const user = await login(values.email, values.password);
      message.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);
    setError('');
    try {
      const user = await register(values.name, values.email, values.password);
      message.success(`Welcome to Flixly, ${user.name}!`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'url(https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.15)' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="login-logo" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3.5rem', color: '#e50914', letterSpacing: '8px', lineHeight: 1 }}>FLIXLY</div>
          <div style={{ color: '#666', fontSize: '0.85rem', letterSpacing: '3px', marginTop: 4 }}>STREAM · DISCOVER · ENJOY</div>
        </div>

        <div style={{ background: 'rgba(26,26,26,0.95)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: '36px 32px', border: '1px solid #2a2a2a' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            items={[
              { key: 'login', label: 'Sign In' },
              { key: 'register', label: 'Create Account' }
            ]}
            style={{ marginBottom: 24 }}
          />

          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />}

          {activeTab === 'login' ? (
            <Form onFinish={handleLogin} layout="vertical" size="large">
              <Form.Item name="email" rules={[{ required: true, message: 'Enter your email' }, { type: 'email', message: 'Invalid email' }]}>
                <Input prefix={<MailOutlined style={{ color: '#555' }} />} placeholder="Email address" style={{ background: '#111', border: '1px solid #333' }} />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: 'Enter your password' }]}>
                <Input.Password prefix={<LockOutlined style={{ color: '#555' }} />} placeholder="Password" style={{ background: '#111', border: '1px solid #333' }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block size="large" danger style={{ height: 48, fontSize: '1rem', fontWeight: 700, letterSpacing: 1 }}>
                  SIGN IN
                </Button>
              </Form.Item>
              <div style={{ textAlign: 'center', color: '#555', fontSize: '0.8rem' }}>
                Admin? Use your admin credentials to access the dashboard.
              </div>
            </Form>
          ) : (
            <Form onFinish={handleRegister} layout="vertical" size="large">
              <Form.Item name="name" rules={[{ required: true, message: 'Enter your name' }]}>
                <Input prefix={<UserOutlined style={{ color: '#555' }} />} placeholder="Full name" style={{ background: '#111', border: '1px solid #333' }} />
              </Form.Item>
              <Form.Item name="email" rules={[{ required: true, message: 'Enter your email' }, { type: 'email', message: 'Invalid email' }]}>
                <Input prefix={<MailOutlined style={{ color: '#555' }} />} placeholder="Email address" style={{ background: '#111', border: '1px solid #333' }} />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, min: 6, message: 'Min 6 characters' }]}>
                <Input.Password prefix={<LockOutlined style={{ color: '#555' }} />} placeholder="Create password" style={{ background: '#111', border: '1px solid #333' }} />
              </Form.Item>
              <Form.Item name="confirm" dependencies={['password']} rules={[{ required: true, message: 'Confirm your password' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) return Promise.resolve(); return Promise.reject(new Error("Passwords don't match")); } })]}>
                <Input.Password prefix={<LockOutlined style={{ color: '#555' }} />} placeholder="Confirm password" style={{ background: '#111', border: '1px solid #333' }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block size="large" danger style={{ height: 48, fontSize: '1rem', fontWeight: 700, letterSpacing: 1 }}>
                  CREATE ACCOUNT
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, color: '#444', fontSize: '0.75rem' }}>
          © 2024 Flixly. All rights reserved.
        </div>
      </div>
    </div>
  );
}
