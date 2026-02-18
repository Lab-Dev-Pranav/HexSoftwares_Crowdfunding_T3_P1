
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateProject() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    goalAmount: '',
    category: '',
    deadline: '',
    returnPercentage: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {

      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not logged in');
      const user = JSON.parse(userStr);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No auth token');

      const payload = {
        ...form,
        goalAmount: Number(form.goalAmount),
        returnPercentage: Number(form.returnPercentage),
        creatorId: user._id || user.id,
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create project');
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', color: '#333', maxWidth: 600, margin: '0 auto' }}>
      <h2>Create Project</h2>
      <h3>Impress your audience with a compelling project</h3>
      <h4>Get Funding for Your Ideas</h4>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label>
          Title*
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Description*
          <textarea name="description" value={form.description} onChange={handleChange} required rows={3} />
        </label>
        <label>
          Goal Amount (USD)*
          <input name="goalAmount" type="number" min="1" value={form.goalAmount} onChange={handleChange} required />
        </label>
        <label>
          Category
          <input name="category" value={form.category} onChange={handleChange} />
        </label>
        <label>
          Deadline
          <input name="deadline" type="date" value={form.deadline} onChange={handleChange} />
        </label>
        <label>
          Promised Return (%)
          <input name="returnPercentage" type="number" min="0" step="0.01" value={form.returnPercentage} onChange={handleChange} required />
        </label>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Project'}</button>
      </form>
    </div>
  );
}