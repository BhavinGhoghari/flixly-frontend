import React, { useState, useEffect } from 'react';
import { Input, Select, Tabs, Spin, Pagination, Empty } from 'antd';
import { SearchOutlined, FireFilled, StarFilled, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { tmdb } from '../../utils/api';
import TMDBMovieCard from '../../components/TMDBMovieCard';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: '🔥 Most Popular' },
  { value: 'vote_average.desc', label: '⭐ Top Rated' },
  { value: 'first_air_date.desc', label: '🗓️ Newest First' },
];

export default function SeriesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('popular');
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [search, setSearch] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => { tmdb.getTVGenres().then(r => setGenres(r.data)); }, []);
  useEffect(() => { if (!search) { setSearchResults([]); fetchSeries(); } }, [activeTab, page, selectedGenre, sortBy]);
  useEffect(() => {
    if (!search) return;
    const t = setTimeout(doSearch, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchSeries = async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === 'popular') res = await tmdb.getPopularSeries(page);
      else if (activeTab === 'top_rated') res = await tmdb.getTopRatedSeries(page);
      else if (activeTab === 'on_the_air') res = await tmdb.getOnTheAir(page);
      else if (activeTab === 'discover') {
        res = await tmdb.discoverTV({ page, sort_by: sortBy, with_genres: selectedGenre });
      }
      const d = res.data;
      setSeries(d.results || []);
      setTotalPages(Math.min(d.total_pages || 1, 500));
      setTotalResults(d.total_results || 0);
    } catch {}
    setLoading(false);
  };

  const doSearch = async () => {
    setSearching(true);
    try {
      const res = await tmdb.search(search, 1, 'series');
      setSearchResults(res.data.results || []);
    } catch {}
    setSearching(false);
  };

  const displayList = search ? searchResults : series;
  const tabs = [
    { key:'popular', label:<><FireFilled /> Popular</> },
    { key:'top_rated', label:<><StarFilled /> Top Rated</> },
    { key:'on_the_air', label:<><ClockCircleOutlined /> On The Air</> },
    { key:'discover', label:'🔍 Discover' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f0f', paddingTop:80 }}>
      <div className="page-header" style={{ background:'linear-gradient(135deg,#0a0a1a 0%,#0f0f0f 100%)', padding:'40px 40px 0' }}>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2rem,6vw,3.5rem)', color:'#fff', letterSpacing:4, marginBottom:8 }}>
          TV SERIES
        </h1>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
          <div style={{ width:4, height:4, borderRadius:'50%', background:'#e50914' }} />
          <span style={{ color:'#555', fontSize:'0.8rem', letterSpacing:2 }}>POWERED BY TMDB</span>
        </div>
        <div style={{ width:60, height:4, background:'#e50914', borderRadius:2, marginBottom:20 }} />
        <Tabs activeKey={activeTab} onChange={k => { setActiveTab(k); setPage(1); }} items={tabs} style={{ marginBottom:0 }} />
      </div>

      <div className="page-container" style={{ padding:'20px 40px', maxWidth:1400, margin:'0 auto' }}>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:20 }}>
          <Input className="search-input-responsive" prefix={<SearchOutlined style={{ color:'#555' }} />} placeholder="Search series..."
            value={search} onChange={e => setSearch(e.target.value)} allowClear
            style={{ width:260, background:'#1a1a1a', border:'1px solid #333' }} size="large" />
          {activeTab === 'discover' && <>
            <Select placeholder="Genre" value={selectedGenre || undefined}
              onChange={v => { setSelectedGenre(v || ''); setPage(1); }} allowClear style={{ width:160 }} size="large">
              {genres.map(g => <Select.Option key={g.id} value={g.id}>{g.name}</Select.Option>)}
            </Select>
            <Select value={sortBy} onChange={v => { setSortBy(v); setPage(1); }} style={{ width:200 }} size="large">
              {SORT_OPTIONS.map(o => <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>)}
            </Select>
          </>}
        </div>

        {!search && <div style={{ color:'#555', fontSize:'0.8rem', marginBottom:16 }}>{totalResults.toLocaleString()} series found</div>}

        {(loading || searching) ? (
          <div style={{ display:'flex', justifyContent:'center', padding:80 }}><Spin size="large" /></div>
        ) : displayList.length === 0 ? (
          <Empty description={<span style={{ color:'#555' }}>No series found</span>} style={{ padding:'60px 0' }} />
        ) : (
          <>
            <div className="movies-grid">
              {displayList.map(m => (
                <TMDBMovieCard key={m.tmdbId} movie={m}
                  onClick={() => navigate(`/movie/${m.tmdbId}?type=series`)} />
              ))}
            </div>
            {!search && totalPages > 1 && (
              <div style={{ display:'flex', justifyContent:'center', marginTop:40 }}>
                <Pagination current={page} total={Math.min(totalResults, 10000)} pageSize={20}
                  onChange={p => { setPage(p); window.scrollTo(0,0); }} showSizeChanger={false} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
