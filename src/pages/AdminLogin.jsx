import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, LogIn, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not configured. Check your environment variables.');
      return;
    }
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="login-root">
      <div className="login-brand">
        <img src="/M2W-favicon.svg" alt="Logo" className="login-logo" />
        <span className="login-brand-name">Mindset 2 Wealth</span>
      </div>

      <div className="login-card">
        <div className="login-card-header">
          <h1 className="login-title">Admin Portal</h1>
          <p className="login-subtitle">Sign in to view and manage your leads</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label className="login-label" htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              className="login-input"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <><Loader2 size={18} className="spin-icon" /> Signing in...</>
            ) : (
              <><LogIn size={18} /> Sign In</>
            )}
          </button>
        </form>
      </div>

      <p className="login-footer">
        Access restricted to authorised users only
      </p>

      <style>{`
        .login-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4f0 0%, #e8f0ec 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          gap: 24px;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .login-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .login-logo {
          width: 36px;
          height: 36px;
        }
        .login-brand-name {
          font-size: 18px;
          font-weight: 600;
          color: #0F3D2E;
          letter-spacing: -0.02em;
        }
        .login-card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 40px rgba(15, 61, 46, 0.12);
          padding: 40px;
          width: 100%;
          max-width: 420px;
        }
        .login-card-header {
          margin-bottom: 32px;
          text-align: center;
        }
        .login-title {
          font-size: 26px;
          font-weight: 700;
          color: #121212;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .login-subtitle {
          font-size: 14px;
          color: rgba(0,0,0,0.5);
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .login-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .login-label {
          font-size: 13px;
          font-weight: 600;
          color: rgba(0,0,0,0.7);
          letter-spacing: 0.01em;
        }
        .login-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e9ecef;
          border-radius: 8px;
          font-size: 15px;
          color: #121212;
          background: #fff;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .login-input:focus {
          border-color: #0F3D2E;
          box-shadow: 0 0 0 3px rgba(15, 61, 46, 0.12);
        }
        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #dc2626;
          font-size: 13px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 10px 14px;
        }
        .login-btn {
          background: #0F3D2E;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px 24px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
          transition: background 0.2s, transform 0.1s;
          margin-top: 4px;
        }
        .login-btn:hover:not(:disabled) {
          background: #175e47;
        }
        .login-btn:active:not(:disabled) {
          transform: scale(0.99);
        }
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .spin-icon {
          animation: spin 0.8s linear infinite;
        }
        .login-footer {
          font-size: 12px;
          color: rgba(0,0,0,0.35);
          text-align: center;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
