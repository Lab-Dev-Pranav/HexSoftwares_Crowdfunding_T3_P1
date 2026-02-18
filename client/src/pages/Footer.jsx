import React from 'react';
import './Footer.css';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-top">


          <div className="footer-brand">
            <h2>FundStarter</h2>
            <p>
              Helping creators turn bold ideas into reality. Discover projects,
              support innovation, and be part of something meaningful.
            </p>
          </div>


          <div className="footer-links">
            <div>
              <h3>Platform</h3>
              <a href="/projects">Browse Projects</a>
              <a href="/start">Start Campaign</a>
              <a href="/how-it-works">How it Works</a>
            </div>

            <div>
              <h3>Company</h3>
              <a href="/about">About</a>
              <a href="/careers">Careers</a>
              <a href="/contact">Contact</a>
            </div>

            <div>
              <h3>Resources</h3>
              <a href="/help">Help Center</a>
              <a href="/faq">FAQ</a>
              <a href="/trust-safety">Trust & Safety</a>
            </div>
          </div>


          <div className="footer-newsletter">
            <h3>Stay in the loop</h3>
            <p>Get updates on trending campaigns.</p>

            <div className="newsletter-box">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
          </div>

        </div>


        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FundStarter</p>

          <div>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/cookies">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
