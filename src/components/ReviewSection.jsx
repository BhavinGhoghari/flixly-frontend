import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Rate, Select, Avatar, Tag, message, Divider, Empty } from 'antd';
import { StarFilled, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const VERDICTS = [
  { value: 'avoid', label: '🚫 Avoid', color: 'error' },
  { value: 'time-pass', label: '😐 Time Pass', color: 'orange' },
  { value: 'one-time-watch', label: '👍 One-Time Watch', color: 'gold' },
  { value: 'go-for-it', label: '✅ Go For It', color: 'green' },
  { value: 'must-watch', label: '🔥 Must Watch', color: 'blue' },
  { value: 'masterpiece', label: '👑 Masterpiece', color: 'purple' },
];

const verdictStyle = {
  'avoid': { bg: '#ff4d4f22', color: '#ff4d4f', border: '#ff4d4f44' },
  'time-pass': { bg: '#fa8c1622', color: '#fa8c16', border: '#fa8c1644' },
  'one-time-watch': { bg: '#fadb1422', color: '#fadb14', border: '#fadb1444' },
  'go-for-it': { bg: '#52c41a22', color: '#52c41a', border: '#52c41a44' },
  'must-watch': { bg: '#1677ff22', color: '#1677ff', border: '#1677ff44' },
  'masterpiece': { bg: '#722ed122', color: '#b37feb', border: '#722ed144' },
};

function VerdictTag({ verdict }) {
  const v = VERDICTS.find(vd => vd.value === verdict);
  const s = verdictStyle[verdict] || {};
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {v?.label || verdict}
    </span>
  );
}

export default function ReviewSection({ movieId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/reviews/movie/${movieId}`);
      setReviews(res.data);
      if (user) setHasReviewed(res.data.some(r => r.user._id === user.id || r.user._id === user._id));
    } catch {}
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await API.post('/reviews', { movieId, ...values });
      message.success('Review submitted!');
      form.resetFields();
      fetchReviews();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to submit review');
    }
    setSubmitting(false);
  };

  const verdictCounts = VERDICTS.map(v => ({
    ...v,
    count: reviews.filter(r => r.verdict === v.value).length
  })).filter(v => v.count > 0);

  return (
    <div>
      {/* Verdict Summary */}
      {verdictCounts.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
          {verdictCounts.map(v => (
            <div key={v.value} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '6px 12px' }}>
              <VerdictTag verdict={v.value} />
              <span style={{ color: '#888', fontSize: '0.8rem' }}>×{v.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Submit Review */}
      {user && !hasReviewed && (
        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: '24px', marginBottom: 32 }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 18, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <StarFilled style={{ color: '#f5c518' }} />
            Write Your Review
          </div>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <Form.Item name="rating" label={<span style={{ color: '#aaa' }}>Your Rating (1–10)</span>} rules={[{ required: true, message: 'Please rate this title' }]}>
                <Rate count={10} style={{ fontSize: 22 }} character={<StarFilled />} />
              </Form.Item>
              <Form.Item name="verdict" label={<span style={{ color: '#aaa' }}>Your Verdict</span>} rules={[{ required: true, message: 'Select a verdict' }]} style={{ minWidth: 200 }}>
                <Select placeholder="How would you rate it?" size="large" style={{ background: '#111' }}>
                  {VERDICTS.map(v => (
                    <Select.Option key={v.value} value={v.value}>{v.label}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <Form.Item name="message" label={<span style={{ color: '#aaa' }}>Your Review</span>} rules={[{ required: true, min: 10, message: 'Write at least 10 characters' }]}>
              <Input.TextArea rows={4} placeholder="Share your thoughts about this title..." style={{ background: '#111', border: '1px solid #333', resize: 'none' }} />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} danger style={{ fontWeight: 700, letterSpacing: 1, paddingInline: 28 }}>
              SUBMIT REVIEW
            </Button>
          </Form>
        </div>
      )}
      {user && hasReviewed && (
        <div style={{ background: '#1a2a1a', border: '1px solid #2a4a2a', borderRadius: 10, padding: '14px 18px', marginBottom: 24, color: '#52c41a', fontSize: '0.9rem' }}>
          ✅ You've already reviewed this title. Thank you!
        </div>
      )}

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <div style={{ color: '#555', textAlign: 'center', padding: 40 }}>Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <Empty description={<span style={{ color: '#555' }}>No reviews yet. Be the first!</span>} />
        ) : (
          reviews.map(review => (
            <div key={review._id} style={{ background: '#1a1a1a', border: '1px solid #252525', borderRadius: 12, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar style={{ background: '#e50914', fontWeight: 700 }}>
                    {review.user?.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{review.user?.name}</div>
                    <div style={{ color: '#555', fontSize: '0.75rem' }}>{dayjs(review.createdAt).fromNow()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: '#111', border: '1px solid #333', borderRadius: 6, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <StarFilled style={{ color: '#f5c518', fontSize: 12 }} />
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{review.rating}/10</span>
                  </div>
                  <VerdictTag verdict={review.verdict} />
                </div>
              </div>
              <p style={{ color: '#ccc', lineHeight: 1.6, fontSize: '0.9rem', margin: 0 }}>{review.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
