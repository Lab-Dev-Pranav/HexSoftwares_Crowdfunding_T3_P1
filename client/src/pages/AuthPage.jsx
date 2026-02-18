import React from 'react';
import Auth from '../components/Auth';

export default function AuthPage({ onLogin }) {
  return (
    <div className="auth-box">
      <Auth onLogin={onLogin} />
    </div>
  );
}
