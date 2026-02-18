import React, { useState } from 'react';
import axios from 'axios';

function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const res = await axios.post('/api/auth/login', {
          email: form.email,
          password: form.password,
        });
        if (res.data.token) {
          setCookie('token', res.data.token);
          localStorage.setItem('token', res.data.token);

          window.location.href = '/';
        }
        window.user = res.data.user || res.data;
        localStorage.setItem('user', JSON.stringify(window.user));
        onLogin(res.data);
      } else {
        const res = await axios.post('/api/auth/register', form);
        if (res.data.token) {
          setCookie('token', res.data.token);
          localStorage.setItem('token', res.data.token);
        }
        window.user = res.data.user || res.data;
        localStorage.setItem('user', JSON.stringify(window.user));
        onLogin(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const styles = {
    hero: {
      minHeight: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      fontFamily: 'Arial, sans-serif',
      padding: '30px 16px',
      borderRadius: '12px',
      //  margin: '40px auto',
      //  maxWidth: '1000px',
    },
    wrapper: {
      width: '100%',
      maxWidth: '950px',

      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '50px',
      flexWrap: 'wrap',
    },
    heroText: {
      color: '#fff',
      flex: 1,
      minWidth: '260px',
    },
    heading: {
      fontSize: '34px',
      color: '#fff',
      marginBottom: '8px',
    },
    subheading: {
      fontSize: '14px',
      opacity: 0.9,
      lineHeight: '1.5',
      maxWidth: '380px',
      margin: '0px 0px 0px 120px',
    },
    card: {
      width: '300px',              
      background: '#fff',
      borderRadius: '14px',
      padding: '18px 18px',      
      boxShadow: '0 18px 35px rgba(0,0,0,0.18)',
    },
    title: {
      textAlign: 'center',
      fontSize: '18px',
      marginBottom: '14px',
      color: '#333',
    },
    field: {
      marginBottom: '10px',         
    },
    label: {
      display: 'block',
      fontSize: '11px',
      marginBottom: '4px',
      color: '#444',
      fontWeight: '600',
    },
    input: {
      width: '100%',
      height: '34px',                 
      borderRadius: '8px',
      border: '1px solid #dcdfff',
      padding: '0 10px',
      fontSize: '12px',
      background: '#f7f8ff',
      color: '#000',
      outline: 'none',
      transition: '0.2s',
      boxSizing: 'border-box',
    },
    passwordWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    eyeButton: {
      position: 'absolute',
      right: '8px',
      top: '-10%',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      color: '#667eea',
    },
    button: {
      width: '100%',
      height: '36px',
      borderRadius: '8px',
      border: 'none',
      background: '#667eea',
      color: '#fff',
      fontSize: '13px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '4px',
    },
    toggle: {
      marginTop: '8px',
      width: '100%',
      border: 'none',
      background: 'none',
      fontSize: '11px',
      color: '#667eea',
      cursor: 'pointer',
    },
    error: {
      marginTop: '6px',
      fontSize: '11px',
      color: 'red',
      textAlign: 'center',
    },
  };

  const focusBorder = (e) =>
    (e.target.style.border = '1px solid #667eea');
  const blurBorder = (e) =>
    (e.target.style.border = '1px solid #dcdfff');

  return (
    <div style={styles.hero}>
      <div style={styles.wrapper}>
    
        <div style={styles.heroText}>
          <h1 style={styles.heading}>Fund Your Ideas 🚀</h1>
          <p style={styles.subheading}>
            Launch projects and connect with supporters.
          </p>
        </div>

  
        <div style={styles.card}>
          <h2 style={styles.title}>
            {isLogin ? 'Login' : 'Register'}
          </h2>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div style={styles.field}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    style={styles.input}
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                    required
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Account Type</label>
                  <select
                    style={styles.input}
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="user">User</option>
                    <option value="creator">Creator</option>
                  </select>
                </div>
              </>
            )}

            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                name="email"
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                onFocus={focusBorder}
                onBlur={blurBorder}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  style={styles.input}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                  required
                />
                <button
                  type="button"
                  style={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button style={styles.button} type="submit">
              {isLogin ? 'Login' : 'Register'}
            </button>
                      {error && <div style={styles.error}>{error}</div>}
          </form>

          <button
            style={styles.toggle}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Create new account"
              : "Back to login"}
          </button>


        </div>
      </div>
    </div>
  );
}