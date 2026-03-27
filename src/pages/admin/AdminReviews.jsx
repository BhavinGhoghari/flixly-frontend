import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Popconfirm, message, Input } from 'antd';
import { DeleteOutlined, StarFilled } from '@ant-design/icons';
import API from '../../utils/api';
import dayjs from 'dayjs';

const VERDICT_LABELS = {
  'avoid': { label: '🚫 Avoid', color: 'red' },
  'time-pass': { label: '😐 Time Pass', color: 'orange' },
  'one-time-watch': { label: '👍 One-Time Watch', color: 'gold' },
  'go-for-it': { label: '✅ Go For It', color: 'green' },
  'must-watch': { label: '🔥 Must Watch', color: 'blue' },
  'masterpiece': { label: '👑 Masterpiece', color: 'purple' },
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await API.get('/reviews/all');
      setReviews(res.data);
    } catch {}
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/reviews/${id}`);
      message.success('Review deleted');
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch {
      message.error('Failed to delete');
    }
  };

  const filtered = reviews.filter(r =>
    !search ||
    r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.movie?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'User',
      key: 'user',
      width: 150,
      render: (_, r) => <div><div style={{ fontWeight: 600, color: '#fff' }}>{r.user?.name}</div><div style={{ color: '#555', fontSize: '0.75rem' }}>{r.user?.email}</div></div>
    },
    {
      title: 'Movie / Series',
      key: 'movie',
      width: 180,
      render: (_, r) => <span style={{ color: '#ddd', fontWeight: 500 }}>{r.movie?.title || '—'}</span>
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 90,
      render: r => <span style={{ color: '#f5c518', fontWeight: 700 }}><StarFilled style={{ fontSize: 11, marginRight: 3 }} />{r}/10</span>
    },
    {
      title: 'Verdict',
      dataIndex: 'verdict',
      key: 'verdict',
      width: 150,
      render: v => {
        const info = VERDICT_LABELS[v] || { label: v, color: 'default' };
        return <Tag color={info.color}>{info.label}</Tag>;
      }
    },
    {
      title: 'Review',
      dataIndex: 'message',
      key: 'message',
      render: msg => <span style={{ color: '#aaa', fontSize: '0.85rem' }}>{msg?.slice(0, 80)}{msg?.length > 80 ? '...' : ''}</span>
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: d => <span style={{ color: '#555', fontSize: '0.8rem' }}>{dayjs(d).format('MMM D, YYYY')}</span>
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_, r) => (
        <Popconfirm title="Delete this review?" onConfirm={() => handleDelete(r._id)} okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}>
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#fff', letterSpacing: 3, marginBottom: 4 }}>REVIEWS</h1>
        <p style={{ color: '#555', fontSize: '0.85rem' }}>{reviews.length} total reviews from users</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input.Search placeholder="Search by user or movie..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 300 }} allowClear />
      </div>

      <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 12, overflow: 'hidden' }}>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 15, showSizeChanger: false }}
          scroll={{ x: 900 }}
        />
      </div>
    </div>
  );
}
