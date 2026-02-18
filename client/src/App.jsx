import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


  import Hero from './components/HeroPage';
import AuthPage from './pages/AuthPage';
import CreateProject from './pages/CreateProject';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import ContributePage from './pages/ContributePage';
import EditProject from './pages/EditProject';
import Footer from './pages/Footer';

import './App.css'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser({ token, user: parsedUser });
        window.user = parsedUser;
      } catch {
        setUser(null);
        window.user = undefined;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      window.user = undefined;
    }
  }, []);

  const handleLogin = (data) => {
    setUser(data);
    if (data && data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      window.user = data.user;
    }
  };

  // Middleware to require authentication
  const RequireAuth = ({ children }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };
  return (
    <Router>
      <div className="container">
        <header>

          <nav className="navbar">
            <div className="navbar-left">
              <h1 ><a className="navtitle" href="/" style={{fontSize:'30px', textDecoration: 'none', color: 'inherit' }}>FundStarter</a></h1>
            </div>
            <div>
              
              <a href="/">Home</a>

              {user && user.user.role === 'creator' && (
                <a className="create-project-button" href="/create-project" style={{ textDecoration: 'none' }}>Create Project</a>
              )}


              {!user && <a href="/auth">Login / Register </a>} &nbsp;&nbsp;
              {user && <span style={{ fontWeight: 'bold', backgroundColor: '#84deff', padding: '5px', borderRadius: '5px' }}> {user.user.name} &nbsp;
                {user.user.role === 'creator' ? (
                  <span style={{ color: '#667eea' }}>#Creator</span>
                ) : user.user.role === 'user' ? (
                  <span style={{ color: '#667eea' }}  >#User</span>
                ) : null}

                <button onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  setUser(null);
                }} style={{ marginLeft: '10px', padding: '5px 10px' }}>
                  <svg fill="#000000" width="20px" height="20px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <title>logout-line</title>
                    <path d="M7,6H23v9.8h2V6a2,2,0,0,0-2-2H7A2,2,0,0,0,5,6V30a2,2,0,0,0,2,2H23a2,2,0,0,0,2-2H7Z" className="clr-i-outline clr-i-outline-path-1"></path><path d="M28.16,17.28a1,1,0,0,0-1.41,1.41L30.13,22H15.63a1,1,0,0,0-1,1,1,1,0,0,0,1,1h14.5l-3.38,3.46a1,1,0,1,0,1.41,1.41L34,23.07Z" className="clr-i-outline clr-i-outline-path-2"></path>
                    <rect x="0" y="0" width="36" height="36" fillOpacity="0" />
                  </svg>
                </button>


              </span>}
            </div>


          </nav>
        </header>
        <main>


               


          <Routes>
            <Route path="/" element={<><Hero /><ProjectList /></>} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/project/:id" element={<RequireAuth><ProjectDetails /></RequireAuth>} />
            <Route path="/project/:id/contribute" element={<RequireAuth><ContributePage /></RequireAuth>} />
            {/* /project/${project._id}/edit */}
            <Route path="/project/:id/edit" element={<EditProject />} />
            <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
          </Routes>
        </main>

        <Footer />

      </div>
    </Router>
  );
}

export default App
