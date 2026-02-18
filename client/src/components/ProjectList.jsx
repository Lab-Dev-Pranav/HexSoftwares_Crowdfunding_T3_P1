import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get('/api/projects')
      .then(res => {
        setProjects(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setProjects([]));
  }, []);

  return (
    <div>
      <h2>Projects</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: 24 }}>
        {projects.map(p => (
          <div key={p._id} style={{
            border: '1px solid #e0e0e0',
            borderRadius: 12,
            boxShadow: '0 2px 8px #e0e0e0',
            padding: 20,
            minWidth: 260,
            maxWidth: 320,
            flex: '1 1 260px',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <h3 style={{ margin: '0 0 8px 0' }}>
              <Link to={`/project/${p._id}`} style={{ textDecoration: 'none', color: '#2b6cb0' }}>{p.title}</Link>
            </h3>
            <div style={{ marginBottom: 8, color: '#666' }}>{p.category}</div>


           {/* display View Details btn only if user login else display login btn */}
          

            {window.user && (
          <Link to={`/project/${p._id}`} style={{ marginTop: 12, padding: '8px 0', borderRadius: 8, background: '#4f46e5', color: '#fff', fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
              View Details
            </Link>
        )}

          {!window.user && (
          <Link to="/auth" style={{ marginTop: 12, padding: '8px 0', borderRadius: 8, background: '#4f46e5', color: '#fff', fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
              Login to View Details
            </Link>
        )}

           




          </div>
        ))}
      </div>
    </div>
  );
}
