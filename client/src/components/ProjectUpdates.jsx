import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CreateUpdate from './CreateUpdate';



export default function ProjectUpdates() {
  const { id } = useParams();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axios.get(`/api/projects/${id}/updates`).then(res => {
      setUpdates(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, refresh]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading updates...</div>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', marginTop: 32 }}>
      <h2 style={{ marginBottom: 16 }}>Project Updates</h2>
      {updates.length === 0 ? (
        <div style={{ color: '#888' }}>No updates yet.</div>
      ) : (
        updates.map(update => (
          <div key={update._id} style={{ color:"#0000ff", background: '#7bacff90', borderRadius: 10, boxShadow: '0 2px 8px #eee', marginBottom: 18, padding: 18 }}>
            <div style={{ fontWeight: 600, fontSize: 17 }}>{update.title}</div>
            <div style={{  margin: '8px 0' }}>{update.content}</div>
            <div style={{ fontSize: 12, color: '#2b75ff' }}>Posted: {new Date(update.createdAt).toLocaleString()}</div>
          </div>
        ))
      )}
    </div>
  );
}
  

