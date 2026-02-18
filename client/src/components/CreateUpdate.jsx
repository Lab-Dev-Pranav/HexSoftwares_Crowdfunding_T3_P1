      import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function CreateUpdate({ onUpdateCreated }) {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // retrieve token from localStorage
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!token) {
        setError('You must be logged in to post an update.');
        setLoading(false);
        return;
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      await axios.post(`/api/projects/${id}/updates`, { title, content }, config);
      setTitle('');
      setContent('');
      if (onUpdateCreated) onUpdateCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create update');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #eee', padding: 18, marginBottom: 24 }}>
      <h3 style={{ marginBottom: 12 }}>Post a Project Update</h3>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Update Title"
        style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
        required
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Update Content"
        style={{ width: '100%', minHeight: 80, marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
        required
      />
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <button type="submit" disabled={loading} style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600 }}>
        {loading ? 'Posting...' : 'Post Update'}
      </button>
    </form>
  );
}
