import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input, Tabs, Spin, Empty } from 'antd';
import { ArrowLeftOutlined, SearchOutlined, TeamOutlined } from '@ant-design/icons';
import { tmdb } from '../../utils/api';

export default function AllCastPage() {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [data, setData]       = useState(null);
  const [title, setTitle]     = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [tab, setTab]         = useState('cast');

  useEffect(() => { window.scrollTo(0,0); fetchAll(); }, [id, mediaType]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [castRes, detailRes] = await Promise.all([
        tmdb.getFullCast(mediaType, id),
        mediaType === 'series' ? tmdb.getSeriesDetail(id) : tmdb.getMovieDetail(id),
      ]);
      setData(castRes.data);
      setTitle(detailRes.data.title);
    } catch {}
    setLoading(false);
  };

  const fallback = name =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a1a&color=e50914&size=185&bold=true`;

  const filteredCast = (data?.cast || []).filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.role?.toLowerCase().includes(search.toLowerCase())
  );

  // Group crew by department
  const crewByDept = {};
  (data?.crew || []).forEach(c => {
    if (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.job?.toLowerCase().includes(search.toLowerCase())) {
      const dept = c.department || 'Other';
      if (!crewByDept[dept]) crewByDept[dept] = [];
      crewByDept[dept].push(c);
    }
  });

  const DEPT_ORDER = ['Directing','Writing','Production','Camera','Editing','Sound','Art','Visual Effects','Lighting','Costume & Make-Up','Crew','Other'];
  const sortedDepts = Object.keys(crewByDept).sort((a,b) => {
    const ai = DEPT_ORDER.indexOf(a), bi = DEPT_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div style={{ background:'#0f0f0f', minHeight:'100vh', paddingTop:80 }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 28px' }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={()=>navigate(-1)}
            style={{ background:'rgba(255,255,255,0.07)', border:'1px solid #2a2a2a', color:'#fff', marginBottom:20, borderRadius:8 }}>
            Back to {title}
          </Button>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(1.8rem,5vw,2.8rem)', color:'#fff', letterSpacing:3, marginBottom:4 }}>
            CAST & CREW
          </h1>
          <div style={{ color:'#555', fontSize:'0.85rem', marginBottom:16 }}>
            <TeamOutlined style={{ marginRight:6, color:'#e50914' }} />
            {title} · {data?.cast?.length || 0} cast · {data?.crew?.length || 0} crew
          </div>

          <Input
            prefix={<SearchOutlined style={{ color:'#555' }} />}
            placeholder="Search cast or crew..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
            style={{ width:300, background:'#1a1a1a', border:'1px solid #2a2a2a' }}
            size="large"
          />
        </div>

        <Tabs activeKey={tab} onChange={setTab}
          items={[
            { key:'cast', label:`Cast (${data?.cast?.length||0})` },
            { key:'crew', label:`Crew (${data?.crew?.length||0})` },
          ]}
          style={{ marginBottom:28 }}
        />

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:80 }}><Spin size="large" /></div>
        ) : tab === 'cast' ? (
          filteredCast.length === 0
            ? <Empty description={<span style={{ color:'#555' }}>No results</span>} />
            : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:18, paddingBottom:60 }}>
                {filteredCast.map(c => (
                  <div key={c.id} onClick={()=>navigate(`/actor/${c.id}`)}
                    style={{ cursor:'pointer', transition:'transform 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-5px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                    <div style={{ borderRadius:12, overflow:'hidden', border:'2px solid #1f1f1f', marginBottom:8, background:'#1a1a1a', position:'relative' }}>
                      <img
                        src={c.profileUrl || fallback(c.name)}
                        alt={c.name}
                        onError={e=>{ e.target.src=fallback(c.name); }}
                        style={{ width:'100%', aspectRatio:'2/3', objectFit:'cover', display:'block' }}
                      />
                      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:60, background:'linear-gradient(to top,rgba(0,0,0,0.9),transparent)' }} />
                    </div>
                    <div style={{ color:'#fff', fontSize:'0.82rem', fontWeight:700, lineHeight:1.3, marginBottom:3 }}>{c.name}</div>
                    {c.role && <div style={{ color:'#666', fontSize:'0.72rem', lineHeight:1.3, fontStyle:'italic' }}>as {c.role}</div>}
                  </div>
                ))}
              </div>
            )
        ) : (
          <div style={{ paddingBottom:60 }}>
            {sortedDepts.length === 0
              ? <Empty description={<span style={{ color:'#555' }}>No results</span>} />
              : sortedDepts.map(dept => (
                <div key={dept} style={{ marginBottom:36 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                    <div style={{ width:4, height:20, background:'#e50914', borderRadius:2 }} />
                    <span style={{ color:'#fff', fontWeight:700, fontSize:'0.95rem', letterSpacing:1, textTransform:'uppercase' }}>{dept}</span>
                    <span style={{ color:'#444', fontSize:'0.8rem' }}>({crewByDept[dept].length})</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
                    {crewByDept[dept].map((c, idx) => (
                      <div key={`${c.id}-${idx}`} onClick={()=>navigate(`/actor/${c.id}`)}
                        style={{ display:'flex', gap:12, alignItems:'center', background:'#111', border:'1px solid #1f1f1f', borderRadius:10, padding:'10px 14px', cursor:'pointer', transition:'background 0.2s' }}
                        onMouseEnter={e=>e.currentTarget.style.background='#1a1a1a'}
                        onMouseLeave={e=>e.currentTarget.style.background='#111'}>
                        <img
                          src={c.profileUrl || fallback(c.name)}
                          alt={c.name}
                          onError={e=>{ e.target.src=fallback(c.name); }}
                          style={{ width:42, height:42, borderRadius:'50%', objectFit:'cover', border:'2px solid #2a2a2a', flexShrink:0 }}
                        />
                        <div style={{ minWidth:0 }}>
                          <div style={{ color:'#fff', fontWeight:600, fontSize:'0.83rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</div>
                          <div style={{ color:'#555', fontSize:'0.72rem', marginTop:2 }}>{c.job}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}
