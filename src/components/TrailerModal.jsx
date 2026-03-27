import React from 'react';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  // Already an embed URL
  if (url.includes('embed')) return url;
  // YouTube watch URL
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
  return url;
}

export default function TrailerModal({ open, onClose, trailerUrl, title }) {
  const embedUrl = getYouTubeEmbedUrl(trailerUrl);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="90vw"
      style={{ maxWidth: 960, top: '5vh' }}
      className="trailer-modal"
      closeIcon={<CloseOutlined style={{ color: '#fff', fontSize: 18 }} />}
      styles={{ body: { padding: 0, background: '#000', borderRadius: 12, overflow: 'hidden' } }}
      destroyOnClose
    >
      <div style={{ background: '#111', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 4, height: 20, background: '#e50914', borderRadius: 2 }} />
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', fontFamily: "'Montserrat', sans-serif" }}>
          {title} — Official Trailer
        </span>
      </div>
      <div className="trailer-container">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={`${title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#555' }}>
            No trailer available
          </div>
        )}
      </div>
    </Modal>
  );
}
