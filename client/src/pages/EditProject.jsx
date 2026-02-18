
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditProject() {
      const [form, setForm] = useState({
            title: 'Organic Herbal Shampoo',
            description: 'A natural shampoo made from organic herbs for healthy hair.',
            category: 'Health & Beauty',
            goalAmount: '100000',
            deadline: '2026-03-31',
            returnPercentage: '10',
      });
      const [error, setError] = useState('');
      const [loading, setLoading] = useState(false);
      const { id } = useParams();
      const navigate = useNavigate();
      const [projectLoaded, setProjectLoaded] = useState(false);

      useEffect(() => {
            axios.get(`/api/projects/${id}`)
                  .then(res => {
                        const p = res.data;
                        setForm({
                              title: p.title || '',
                              description: p.description || '',
                              category: p.category || '',
                              goalAmount: p.goalAmount ? String(p.goalAmount) : '',
                              deadline: p.deadline ? p.deadline.slice(0, 10) : '',
                              returnPercentage: p.returnPercentage ? String(p.returnPercentage) : '',
                        });
                        setProjectLoaded(true);
                  })
                  .catch(() => setError('Failed to load project data'));
      }, [id]);

      const handleChange = e => {
            setForm({ ...form, [e.target.name]: e.target.value });
      };

      const handleSubmit = async e => {
            e.preventDefault();
            setError('');
            setLoading(true);
            try {
                  const token = localStorage.getItem('token');
                  await axios.put(`/api/projects/${id}`, {
                        title: form.title,
                        description: form.description,
                        category: form.category,
                        goalAmount: Number(form.goalAmount),
                        deadline: form.deadline,
                  }, {
                        headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`,
                        },
                  });
                  navigate(`/project/${id}`);
            } catch (err) {
                  setError(err.response?.data?.message || 'Failed to update project');
            }
            setLoading(false);
      };

      if (!projectLoaded) {
            return <div style={{ textAlign: 'center', marginTop: 100 }}>Loading project data...</div>;
      }

      return (
            <div style={{ maxWidth: 500, margin: '48px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #e0e0e0', padding: 32 }}>
                  <h2>Edit Project Details</h2>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <label>
                              Title:
                              <input name="title" value={form.title} onChange={handleChange} required style={{ marginLeft: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc', width: '100%' }} />
                        </label>
                        <label>
                              Description:
                              <textarea name="description" value={form.description} onChange={handleChange} required style={{ marginLeft: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc', width: '100%' }} />
                        </label>
                        <label>
                              Category:
                              <input name="category" value={form.category} onChange={handleChange} required style={{ marginLeft: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc', width: '100%' }} />
                        </label>
                        <label>
                              Goal Amount:
                              <input name="goalAmount" type="number" min="1" value={form.goalAmount} onChange={handleChange} required style={{ marginLeft: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc', width: '100%' }} />
                        </label>
                        <label>
                              Deadline:
                              <input name="deadline" type="date" value={form.deadline} onChange={handleChange} required style={{ marginLeft: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc', width: '100%' }} />
                        </label>
                        <label>
                              Status:
                              <select name="status" value={form.status || ''} onChange={handleChange} required style={{ marginLeft: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc', width: '100%' }}>
                                    <option value="active">Active</option>
                                    <option value="funded">Funded</option>
                                    <option value="expired">Expired</option>
                              </select>
                        </label>
                        <label>
                              Promised Return:
                              <input name="returnPercentage" value={form.returnPercentage} disabled style={{ marginLeft: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc', width: '100%', background: '#eee' }} />
                        </label>
                        {error && <div style={{ color: 'red' }}>{error}</div>}
                        <button type="submit" disabled={loading} style={{ padding: '10px 0', borderRadius: 8, background: '#4f46e5', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                              {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                  </form>
            </div>
      );

}

