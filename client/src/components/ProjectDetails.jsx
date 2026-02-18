import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProjectUpdates from './ProjectUpdates';
import CreateUpdate from './CreateUpdate';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    axios.get(`/api/projects/${id}`).then(res => {
      setProject(res.data);
    });
    axios.get(`/api/projects/${id}/contributions`).then(res => {
      setContributions(res.data);
    });
  }, [id]);

  if (!project) return <div style={styles.loading}>Loading...</div>;

  const creator = project.creatorId;
  const creatorName = creator?.name || creator?.username || 'Unknown Creator';
  const creatorEmail = creator?.email;

  const percent = project.goalAmount
    ? Math.min(100, Math.round((project.currentAmount / project.goalAmount) * 100))
    : 0;

  const deadline = project.deadline
    ? new Date(project.deadline).toLocaleDateString()
    : null;

  const createdAt = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString()
    : null;

  // clculate investment % for each contribution
  const getInvestmentPercent = (amount) => {
    if (!project.goalAmount) return 0;
    return ((amount / project.goalAmount) * 100).toFixed(2);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* creator Section */}
        <div style={styles.creatorSection}>
          <div style={styles.avatar}>
            {creatorName[0]?.toUpperCase() || 'U'}
          </div>

          <div>
            <div style={styles.creatorName}>{creatorName}</div>
            {creatorEmail && (
              <div style={styles.creatorEmail}>{creatorEmail}</div>
            )}
            <div style={styles.category}>{project.category}</div>
          </div>
        </div>

        {/* title */}
        <h2 style={styles.title}>{project.title}</h2>

        {/* description */}
        <p style={styles.description}>{project.description}</p>

        {/* Funding */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Funding Progress</div>


          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: percent + '%',
              }}
            />
          </div>

          <div style={styles.fundingText}>
            <span style={styles.currentAmount}>
              ${project.currentAmount}
            </span>
            <span style={styles.goalAmount}>
              {' '} / ${project.goalAmount}
            </span>
            <span style={styles.percent}>
              {' '} ({percent}%)
            </span>
          </div>
        </div>

   
        <div style={styles.metaGrid}>
          <div><b>Status:</b> {project.status}</div>
          {deadline && <div><b>Deadline:</b> {deadline}</div>}
          {createdAt && <div><b>Created:</b> {createdAt}</div>}
          <div><b>Promised Return:</b> {project.returnPercentage}%</div>
        </div>



              {/* actions */}
        {window.user?.role === "user" && (
          <div style={styles.buttonRow}>
            <a href={`/project/${project._id}/contribute`} style={{ ...styles.primaryBtn, textAlign: 'center', textDecoration: 'none', display: 'inline-block' }}>Contribute</a>
          </div>
        )}

     
        {
          window.user?.role === "creator" && (
            <div style={styles.buttonRow}>
              <a href={`/project/${project._id}/edit`} style={{ ...styles.primaryBtn, textAlign: 'center', textDecoration: 'none', display: 'inline-block' }}>Edit Project</a>
            </div>
          )
        }

        {/* contributers List */}
        {contributions.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Investors</div>
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
              {contributions.map((c) => (
                <li key={c._id} style={{ marginBottom: 6, fontSize: 14 }}>
                  <span style={{ fontWeight: 500 }}>
                    {c.userId?.name || c.userId?.username || 'User'}
                  </span>
                  {' invested '}
                  {/* <span style={{ color: '#16a34a', fontWeight: 600 }}>
                      ${c.amount}
                    </span> */}

                  <span style={{ color: '#4f46e5' }}>{getInvestmentPercent(c.amount)}%</span>

                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginTop: 32 }}>

          {window.user?.role === "creator" && (
            <CreateUpdate onUpdateCreated={() => { }} />
          )}
          <ProjectUpdates />
        </div>





      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f7fb',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  },

  loading: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
    color: '#666',
  },

  card: {
    background: '#fff',
    borderRadius: 16,
    padding: 28,
    margin:"10px 0px 0px 0px",
    width: '100%',
    maxWidth: 720,
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  },

  creatorSection: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 14,
  },

  creatorName: {
    fontWeight: 600,
    fontSize: 16,
  },

  creatorEmail: {
    fontSize: 12,
    color: '#888',
  },

  category: {
    fontSize: 12,
    color: '#4f46e5',
    fontWeight: 500,
    marginTop: 2,
  },

  title: {
    margin: '8px 0',
  },

  description: {
    color: '#444',
    lineHeight: 1.6,
    marginBottom: 20,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontWeight: 600,
    marginBottom: 8,
  },

  progressBar: {
    height: 14,
    background: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #22c55e, #16a34a)',
    transition: '0.4s ease',
  },

  fundingText: {
    marginTop: 8,
    fontSize: 14,
  },

  currentAmount: {
    color: '#16a34a',
    fontWeight: 600,
  },

  goalAmount: {
    color: '#555',
  },

  percent: {
    color: '#888',
  },

  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 8,
    fontSize: 14,
    marginBottom: 24,
  },

  buttonRow: {
    display: 'flex',
    gap: 12,
  },

  primaryBtn: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: 10,
    border: 'none',
    background: '#4f46e5',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },

  secondaryBtn: {
    flex: 1,
    color: '#4f46e5',
    padding: '10px 16px',
    borderRadius: 10,
    border: '1px solid #050505',
    background: '#fff',
    fontWeight: 500,
    cursor: 'pointer',
  },
};
