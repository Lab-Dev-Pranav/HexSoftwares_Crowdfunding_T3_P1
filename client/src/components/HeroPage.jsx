
import "./HeroPage.css";
import { useEffect, useState } from "react";

export default function Hero() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/projects/top-invested")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch project");
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-left">
          <div className="hero-badge">🚀 Trusted by 12,000+ backers</div>
          <h1 >
            Fund Ideas <span>That Matter</span>
          </h1>
          <p>
            Launch your project, raise funds from supporters, and turn bold visions into reality.
          </p>
          <div className="hero-stats">
            <div>
              <h3>₹10M+</h3>
              <span>Funds Raised</span>
            </div>
            <div>
              <h3>5,000+</h3>
              <span>Projects Launched</span>
            </div>
            <div>
              <h3>12,000+</h3>
              <span>Happy Backers</span>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <div className="project-card">
            <img src="/hero-image.png" alt="Project" />
            <div className="card-content">
              {loading ? (
                <h4>Loading top project...</h4>
              ) : error ? (
                <h4 style={{ color: "red" }}>Error: {error}</h4>
              ) : project ? (
                <>
                  <p>Our Top Invested</p>
                  <h4>{project.title} 🌿</h4>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${Math.min(100, (project.currentAmount / project.goalAmount) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="funding-info">
                    <span>₹{project.currentAmount.toLocaleString()} raised</span>
                    <span>₹{project.goalAmount.toLocaleString()} goal</span>
                  </div>
                  <div className="funding-info">
                    <span style={{ color: "#e67e22" }}>
                      ₹{(project.goalAmount - project.currentAmount).toLocaleString()} remaining
                    </span>
                  </div>
                  <button onClick={() => window.location.href = `/project/${project._id}`}>View Project</button>
                </>
              ) : (
                <h4>No project found</h4>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
