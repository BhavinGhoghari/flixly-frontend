import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, Switch, message, Tag, Popconfirm, Space, Tabs, Tooltip, Spin, Empty, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ImportOutlined, SearchOutlined, StarFilled, CheckCircleFilled } from '@ant-design/icons';
import API, { tmdb } from '../../utils/api';
import TMDBMovieCard from '../../components/TMDBMovieCard';

const { TextArea } = Input;
const GENRES = ['Action','Comedy','Drama','Horror','Thriller','Romance','Sci-Fi','Fantasy','Animation','Documentary','Adventure','Crime','Mystery','Biography','History','Sport','Musical'];

export default function AdminMovies() {
  const [activeMainTab, setActiveMainTab] = useState('library');

  const [movies, setMovies] = useState([]);
  const [libLoading, setLibLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [libSearch, setLibSearch] = useState('');
  const [libType, setLibType] = useState('all');
  const [form] = Form.useForm();

  const [tmdbTab, setTmdbTab] = useState('popular_movies');
  const [tmdbMovies, setTmdbMovies] = useState([]);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [tmdbPage, setTmdbPage] = useState(1);
  const [tmdbTotal, setTmdbTotal] = useState(0);
  const [tmdbSearch, setTmdbSearch] = useState('');
  const [tmdbSearchResults, setTmdbSearchResults] = useState([]);
  const [tmdbSearching, setTmdbSearching] = useState(false);
  const [importingIds, setImportingIds] = useState(new Set());
  const [importedIds, setImportedIds] = useState(new Set());

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => { fetchLibrary(); }, []);
  useEffect(() => { if (activeMainTab === 'tmdb') fetchTMDB(); }, [tmdbTab, tmdbPage, activeMainTab]);
  useEffect(() => {
    if (!tmdbSearch) { setTmdbSearchResults([]); return; }
    const t = setTimeout(doTMDBSearch, 400);
    return () => clearTimeout(t);
  }, [tmdbSearch]);

  const fetchLibrary = async () => {
    setLibLoading(true);
    try { const r = await API.get('/movies?limit=200'); setMovies(r.data.movies); }
    catch {}
    setLibLoading(false);
  };

  const fetchTMDB = async () => {
    setTmdbLoading(true);
    try {
      let res;
      if (tmdbTab === 'popular_movies') res = await tmdb.getPopularMovies(tmdbPage);
      else if (tmdbTab === 'top_rated_movies') res = await tmdb.getTopRatedMovies(tmdbPage);
      else if (tmdbTab === 'upcoming') res = await tmdb.getUpcomingMovies(tmdbPage);
      else if (tmdbTab === 'popular_series') res = await tmdb.getPopularSeries(tmdbPage);
      else if (tmdbTab === 'top_rated_series') res = await tmdb.getTopRatedSeries(tmdbPage);
      else if (tmdbTab === 'on_the_air') res = await tmdb.getOnTheAir(tmdbPage);
      else if (tmdbTab === 'trending') res = await tmdb.getTrending('week');
      const d = res.data;
      setTmdbMovies(d.results || []);
      setTmdbTotal(Math.min((d.total_results || 0), 10000));
    } catch {}
    setTmdbLoading(false);
  };

  const doTMDBSearch = async () => {
    setTmdbSearching(true);
    try {
      const res = await tmdb.search(tmdbSearch, 1, 'all');
      setTmdbSearchResults(res.data.results || []);
    } catch {}
    setTmdbSearching(false);
  };

  const handleImport = async (item) => {
    const key = `${item.type}_${item.tmdbId}`;
    setImportingIds(prev => new Set([...prev, key]));
    try {
      await tmdb.importTitle(item.tmdbId, item.type);
      message.success(`"${item.title}" imported to library!`);
      setImportedIds(prev => new Set([...prev, key]));
      fetchLibrary();
    } catch (err) {
      if (err.response?.status === 409) {
        message.info(`"${item.title}" is already in your library`);
        setImportedIds(prev => new Set([...prev, key]));
      } else {
        message.error(err.response?.data?.message || 'Import failed');
      }
    }
    setImportingIds(prev => { const s = new Set(prev); s.delete(key); return s; });
  };

  const openDetail = async (item) => {
    setDetailData(null);
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const fn = item.type === 'series' ? tmdb.getSeriesDetail : tmdb.getMovieDetail;
      const res = await fn(item.tmdbId);
      setDetailData({ ...res.data, tmdbId: item.tmdbId });
    } catch {}
    setDetailLoading(false);
  };

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ type:'movie', status:'active', featured:false });
    setEditModalOpen(true);
  };
  const openEdit = (r) => {
    setEditing(r);
    form.setFieldsValue({ ...r, cast: r.cast?.map(c => `${c.name}:${c.role}`).join('\n') || '' });
    setEditModalOpen(true);
  };
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (values.cast && typeof values.cast === 'string')
        values.cast = values.cast.split('\n').filter(Boolean).map(l => { const [n,r] = l.split(':'); return { name:n?.trim(), role:r?.trim() }; });
      if (values.tags && typeof values.tags === 'string')
        values.tags = values.tags.split(',').map(t => t.trim()).filter(Boolean);
      if (editing) { await API.put(`/movies/${editing._id}`, values); message.success('Updated!'); }
      else { await API.post('/movies', values); message.success('Added!'); }
      setEditModalOpen(false); fetchLibrary();
    } catch (err) { message.error(err.response?.data?.message || 'Failed'); }
    setSubmitting(false);
  };
  const handleDelete = async (id) => {
    try { await API.delete(`/movies/${id}`); message.success('Deleted'); setMovies(prev => prev.filter(m => m._id !== id)); }
    catch { message.error('Failed to delete'); }
  };

  const filteredLib = movies.filter(m => {
    const mt = libType === 'all' || (m.type || '').toLowerCase() === libType.toLowerCase() || (m.type === 'tv' && libType === 'series');
    const ms = !libSearch || m.title.toLowerCase().includes(libSearch.toLowerCase());
    return mt && ms;
  });

  const libCols = [
    { title:'Title', key:'title', render:(_,r) => (
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <img src={r.posterUrl || 'https://placehold.co/36x54/1a1a1a/e50914?text=F'} alt=""
          style={{ width:36, height:54, objectFit:'cover', borderRadius:4 }}
          onError={e => e.target.src='https://placehold.co/36x54/1a1a1a/e50914?text=F'} />
        <div>
          <div style={{ fontWeight:600, color:'#fff' }}>{r.title}</div>
          <div style={{ color:'#555', fontSize:'0.75rem' }}>{r.releaseYear} • {r.language}</div>
        </div>
      </div>
    )},
    { title:'Type', dataIndex:'type', key:'type', render:t => <span className="badge-type">{t}</span>, width:90 },
    { title:'Rating', dataIndex:'rating', key:'rating', width:80, render:r => r > 0 ? <span style={{ color:'#01d277', fontWeight:700 }}><StarFilled style={{ fontSize:11, marginRight:3 }} />{r}</span> : '—' },
    { title:'Status', dataIndex:'status', key:'status', width:90, render:s => <Tag color={s==='active'?'green':'red'}>{s}</Tag> },
    { title:'Actions', key:'actions', width:120, render:(_,r) => (
      <Space>
        <Tooltip title="Edit"><Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} /></Tooltip>
        <Popconfirm title="Delete this?" onConfirm={() => handleDelete(r._id)} okButtonProps={{ danger:true }}>
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    )},
  ];

  const tmdbTabs = [
    { key:'popular_movies', label:'🎬 Popular Movies' },
    { key:'top_rated_movies', label:'⭐ Top Rated Movies' },
    { key:'upcoming', label:'📅 Upcoming' },
    { key:'popular_series', label:'📺 Popular Series' },
    { key:'top_rated_series', label:'🏆 Top Rated Series' },
    { key:'on_the_air', label:'📡 On The Air' },
    { key:'trending', label:'🔥 Trending' },
  ];

  const displayTMDB = tmdbSearch ? tmdbSearchResults : tmdbMovies;

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', color:'#fff', letterSpacing:3, marginBottom:0 }}>MOVIES & SERIES</h1>
          <p style={{ color:'#555', fontSize:'0.85rem' }}>{movies.length} titles in library</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {activeMainTab === 'library' && (
            <Button type="primary" danger icon={<PlusOutlined />} size="large" onClick={openAdd} style={{ fontWeight:700 }}>
              ADD MANUALLY
            </Button>
          )}
        </div>
      </div>

      <Tabs activeKey={activeMainTab} onChange={setActiveMainTab}
        items={[
          { key:'library', label:'📚 My Library' },
          { key:'tmdb', label:'🌐 Browse TMDB' },
        ]}
        style={{ marginBottom:20 }}
      />

      {activeMainTab === 'library' && (
        <>
          <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap' }}>
            <Input.Search placeholder="Search library..." value={libSearch} onChange={e => setLibSearch(e.target.value)} style={{ width:260, flex:'1 1 200px' }} allowClear />
            <Select value={libType} onChange={setLibType} style={{ width:130, flex:'0 0 130px' }}>
              <Select.Option value="all">All Types</Select.Option>
              <Select.Option value="movie">Movies</Select.Option>
              <Select.Option value="series">Series</Select.Option>
            </Select>
          </div>
          <div style={{ background:'#111', border:'1px solid #1f1f1f', borderRadius:12, overflow:'hidden' }}>
            <Table dataSource={filteredLib} columns={libCols} rowKey="_id" loading={libLoading}
              pagination={{ pageSize:15, showSizeChanger:false }} scroll={{ x: 'max-content' }} />
          </div>
        </>
      )}

      {activeMainTab === 'tmdb' && (
        <div>
          {/* Search */}
          <div style={{ marginBottom:16 }}>
             <Input className="admin-search-input" prefix={<SearchOutlined style={{ color:'#555' }} />} placeholder="Search TMDB..."
              value={tmdbSearch} onChange={e => setTmdbSearch(e.target.value)} allowClear size="large"
              style={{ width:'100%', maxWidth:400, background:'#1a1a1a', border:'1px solid #333' }} />
          </div>

          {!tmdbSearch && (
            <Tabs activeKey={tmdbTab} onChange={k => { setTmdbTab(k); setTmdbPage(1); }} items={tmdbTabs} style={{ marginBottom:16 }} />
          )}

          {tmdbSearch && (
            <div style={{ color:'#555', marginBottom:16, fontSize:'0.85rem' }}>
              {tmdbSearching ? 'Searching...' : `${tmdbSearchResults.length} results for "${tmdbSearch}"`}
            </div>
          )}

          {(tmdbLoading || tmdbSearching) ? (
            <div style={{ display:'flex', justifyContent:'center', padding:80 }}><Spin size="large" /></div>
          ) : displayTMDB.length === 0 ? (
            <Empty description={<span style={{ color:'#555' }}>No results</span>} style={{ padding:'60px 0' }} />
          ) : (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:16 }}>
                {displayTMDB.map(item => {
                  const key = `${item.type}_${item.tmdbId}`;
                  const isImported = importedIds.has(key);
                  const isImporting = importingIds.has(key);
                  return (
                    <div key={key} style={{ position:'relative' }}>
                      <TMDBMovieCard movie={item} onClick={() => openDetail(item)} />
                      {/* Import button overlay */}
                      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'8px 6px', background:'linear-gradient(to top,rgba(0,0,0,0.95),transparent)', display:'flex', gap:4 }}>
                        <Button size="small" block
                          icon={isImported ? <CheckCircleFilled style={{ color:'#52c41a' }} /> : <ImportOutlined />}
                          loading={isImporting}
                          onClick={e => { e.stopPropagation(); handleImport(item); }}
                          style={{ background: isImported ? 'rgba(82,196,26,0.15)' : 'rgba(229,9,20,0.9)', border:'none', color:isImported ? '#52c41a' : '#fff', fontSize:'0.72rem', fontWeight:700 }}>
                          {isImported ? 'In Library' : 'Import'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!tmdbSearch && tmdbTotal > 20 && (
                <div style={{ display:'flex', justifyContent:'center', marginTop:32 }}>
                  <Pagination current={tmdbPage} total={tmdbTotal} pageSize={20}
                    onChange={p => { setTmdbPage(p); window.scrollTo(0,200); }} showSizeChanger={false} />
                </div>
              )}
            </>
          )}
        </div>
      )}

      <Modal open={detailModalOpen} onCancel={() => setDetailModalOpen(false)} footer={null} width={700}
        style={{ maxWidth: '95vw' }}
        title={<span style={{ color:'#fff' }}>TMDB Details</span>}
        styles={{ content:{ background:'#1a1a1a', border:'1px solid #2a2a2a' }, header:{ background:'#1a1a1a', borderBottom:'1px solid #2a2a2a' } }}
        destroyOnClose>
        {detailLoading ? <div style={{ textAlign:'center', padding:60 }}><Spin size="large" /></div> : detailData && (
          <div>
            <div style={{ display:'flex', gap:20, marginBottom:20 }}>
              <img src={detailData.posterUrl} alt={detailData.title}
                style={{ width:120, borderRadius:8, objectFit:'cover' }}
                onError={e => e.target.style.display='none'} />
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem', color:'#fff', letterSpacing:2, marginBottom:8 }}>{detailData.title}</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
                  {detailData.genre?.map(g => <Tag key={g}>{g}</Tag>)}
                </div>
                <div style={{ color:'#aaa', fontSize:'0.85rem', display:'flex', gap:16, flexWrap:'wrap' }}>
                  {detailData.releaseYear && <span>📅 {detailData.releaseYear}</span>}
                  {detailData.duration && <span>⏱️ {detailData.duration}</span>}
                  {detailData.rating > 0 && <span style={{ color:'#01d277' }}>⭐ {detailData.rating}/10</span>}
                  {detailData.director && <span>🎬 {detailData.director}</span>}
                </div>
              </div>
            </div>
            <p style={{ color:'#ccc', lineHeight:1.7, fontSize:'0.9rem', marginBottom:20 }}>{detailData.description}</p>
            {detailData.cast?.length > 0 && (
              <div style={{ marginBottom:16 }}>
                <div style={{ color:'#888', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Cast</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {detailData.cast.slice(0,8).map((c,i) => (
                    <Tag key={i} style={{ background:'#111', border:'1px solid #333', color:'#ddd', fontSize:'0.75rem' }}>{c.name}</Tag>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <Button type="primary" danger icon={<ImportOutlined />}
                onClick={() => { handleImport({ tmdbId: detailData.tmdbId, type: detailData.type, title: detailData.title }); setDetailModalOpen(false); }}
                style={{ fontWeight:700 }}>
                Import to Library
              </Button>
              <Button onClick={() => setDetailModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={editModalOpen} onCancel={() => setEditModalOpen(false)} title={<span style={{ color:'#fff' }}>{editing ? 'Edit Title' : 'Add New Title'}</span>}
        footer={null} width={800}
        style={{ maxWidth: '98vw' }}
        styles={{ content:{ background:'#1a1a1a', border:'1px solid #2a2a2a' }, header:{ background:'#1a1a1a', borderBottom:'1px solid #2a2a2a' } }}
        destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop:20 }}>
          <div className="admin-form-grid" style={{ display:'grid', gap:16 }}>
            <Form.Item name="title" label="Title" rules={[{ required:true }]}><Input /></Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required:true }]}>
              <Select><Select.Option value="movie">Movie</Select.Option><Select.Option value="series">Series</Select.Option></Select>
            </Form.Item>
          </div>
          <Form.Item name="description" label="Description" rules={[{ required:true }]}><TextArea rows={3} /></Form.Item>
          <div className="admin-form-grid" style={{ display:'grid', gap:16 }}>
            <Form.Item name="genre" label="Genres">
              <Select mode="multiple">{GENRES.map(g => <Select.Option key={g} value={g}>{g}</Select.Option>)}</Select>
            </Form.Item>
            <Form.Item name="director" label="Director"><Input /></Form.Item>
          </div>
          <div className="admin-form-grid" style={{ display:'grid', gap:16 }}>
            <Form.Item name="releaseYear" label="Year"><InputNumber style={{ width:'100%' }} min={1900} max={2030} /></Form.Item>
            <Form.Item name="duration" label="Duration"><Input placeholder="2h 10m" /></Form.Item>
            <Form.Item name="rating" label="Rating"><InputNumber style={{ width:'100%' }} min={0} max={10} step={0.1} /></Form.Item>
          </div>
          <Form.Item name="posterUrl" label="Poster URL"><Input /></Form.Item>
          <Form.Item name="backdropUrl" label="Backdrop URL"><Input /></Form.Item>
          <Form.Item name="trailerUrl" label="Trailer URL (YouTube)"><Input /></Form.Item>
          <Form.Item name="cast" label="Cast (Name:Role, one per line)"><TextArea rows={3} /></Form.Item>
          <div className="admin-form-grid" style={{ display:'grid', gap:16 }}>
            <Form.Item name="status" label="Status">
              <Select><Select.Option value="active">Active</Select.Option><Select.Option value="inactive">Inactive</Select.Option></Select>
            </Form.Item>
            <Form.Item name="featured" label="Featured" valuePropName="checked"><Switch /></Form.Item>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:12, marginTop:8 }}>
            <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" danger htmlType="submit" loading={submitting} style={{ fontWeight:700 }}>
              {editing ? 'UPDATE' : 'ADD TITLE'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
