import "./HeroPage.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">

 
        <div className="hero-left">
          <div className="hero-badge">
            🚀 Trusted by 12,000+ backers
          </div>

          <h1>
            Fund Ideas <span>That Matter</span>
          </h1>

          <p>
            Launch your project, raise funds from supporters,
            and turn bold visions into reality.
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
            <img src="client\public\hero-image.png" alt="Project" />

            <div className="card-content">
              <h4>Organic Herbal Shampoo 🌿</h4>

              <div className="progress-bar">
                <div className="progress"></div>
              </div>

              <div className="funding-info">
                <span>₹66,000 raised</span>
                <span>₹1,00,000 goal</span>
              </div>

              <button>View Project</button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
