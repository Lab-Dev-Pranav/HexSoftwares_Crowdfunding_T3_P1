import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ContributePage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/projects/${id}`).then(res => setProject(res.data));
  }, [id]);

  if (!project) return <div style={{ textAlign: 'center', marginTop: 100 }}>Loading...</div>;

  const maxContribution = Math.max(0, project.goalAmount - project.currentAmount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!amount || amount.trim() === '') {
      setError('Amount is required.');
      return;
    }
    if (!/^[0-9]+$/.test(amount)) {
      setError('Amount must be a positive integer.');
      return;
    }
    const value = Number(amount);
    if (value <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }
    if (value > maxContribution) {
      setError(`You can contribute up to ${maxContribution}`);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Token used for contribution:', token);
      const res = await fetch(`/api/projects/${project._id}/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: value }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Contribution failed');
      }
      setSuccess('Thank you for your contribution!');
      setAmount('');

      const updated = await res.json();
      setProject(updated);
      setTimeout(() => navigate(`/project/${project._id}`), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '48px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #e0e0e0', padding: 32 }}>
      <h2>Contribute to: {project.title}</h2>
      <div style={{ marginBottom: 12, color: '#666' }}>Goal: {project.goalAmount} | Raised: {project.currentAmount}</div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} noValidate>
        <label>
          Amount (max {maxContribution}):
          <input
            type="number"
            min="1"
            max={maxContribution}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            disabled={maxContribution === 0 || loading}
            style={{ marginLeft: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc', width: 120 }}
            required
          />
        </label>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
        <button type="submit" disabled={loading || maxContribution === 0} style={{ padding: '10px 0', borderRadius: 8, background: '#4f46e5', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          {loading ? 'Processing...' : 'Contribute'}
        </button>
      </form>
      <button onClick={() => navigate(`/project/${project._id}`)} style={{ marginTop: 16, background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer' }}>Back to Project</button>
    </div>
  );
}
