import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import { DashboardOutlined, VideoCameraOutlined, TeamOutlined, StarOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Sider, Header, Content } = Layout;

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1200);
  const [mobileMode, setMobileMode] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setMobileMode(window.innerWidth < 768);
      if (window.innerWidth < 1200) setCollapsed(true);
      else setCollapsed(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeResizeListener('resize', handleResize);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/admin/movies', icon: <VideoCameraOutlined />, label: 'Movies & Series' },
    { key: '/admin/users', icon: <TeamOutlined />, label: 'Users' },
    { key: '/admin/reviews', icon: <StarOutlined />, label: 'Reviews' },
  ];

  const userMenu = [
    { key: 'user', label: <span style={{ color: '#888' }}>{user?.email}</span>, disabled: true },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: <span style={{ color: '#ff4d4f' }}>Sign Out</span>, onClick: handleLogout },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#0f0f0f' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={220}
        collapsedWidth={mobileMode ? 0 : 80}
        style={{
          background: '#111',
          borderRight: '1px solid #1f1f1f',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 100,
          overflow: 'auto'
        }}
      >
        {/* Logo */}
        <div style={{ padding: collapsed ? '24px 16px' : '24px 20px', borderBottom: '1px solid #1f1f1f' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: collapsed ? '1.2rem' : '1.8rem', color: '#e50914', letterSpacing: 4, cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => navigate('/admin')}>
            {collapsed ? 'F' : 'FLIXLY'}
          </div>
          {!collapsed && <div style={{ color: '#444', fontSize: '0.65rem', letterSpacing: 3, marginTop: 2 }}>ADMIN PANEL</div>}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', border: 'none', padding: '12px 0' }}
        />

        {/* View Site */}
        {!collapsed && (
          <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, padding: '0 16px' }}>
            <Button
              block
              onClick={() => navigate('/')}
              style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.3)', color: '#e50914', fontSize: '0.8rem' }}
            >
              View Site
            </Button>
          </div>
        )}
      </Sider>

      <Layout style={{
        marginLeft: mobileMode ? 0 : (collapsed ? 80 : 220),
        transition: 'margin 0.3s',
        background: '#0f0f0f'
      }}>
        <Header style={{ background: '#111', borderBottom: '1px solid #1f1f1f', padding: mobileMode ? '0 16px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 99, height: 60 }}>
          {!mobileMode && (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ color: '#aaa', fontSize: 16 }}
            />
          )}
          {mobileMode && <div />} {/* Placeholder for flex-end if logo is gone */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {!mobileMode && <span style={{ color: '#666', fontSize: '0.8rem' }}>Admin Panel</span>}
            <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={['click']}>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar style={{ background: '#e50914', fontWeight: 700, fontSize: '0.9rem' }}>
                  {user?.name?.[0]?.toUpperCase()}
                </Avatar>
                {!mobileMode && <span style={{ color: '#ddd', fontSize: '0.85rem', fontWeight: 500 }}>{user?.name}</span>}
              </div>
            </Dropdown>

            {/* Mobile Menu Toggle Moved to Right */}
            {mobileMode && (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ color: '#aaa', fontSize: 18, marginLeft: 8 }}
              />
            )}
          </div>
        </Header>

        <Content style={{ padding: '28px 24px', minHeight: 'calc(100vh - 60px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
