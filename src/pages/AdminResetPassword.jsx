import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../supabase';

export default function AdminResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Verify we have an active recovery session
  useEffect(() => {
    async function checkSession() {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        // Give Supabase client a moment to parse hash token
        setTimeout(async () => {
          const { data: retryData } = await supabase.auth.getSession();
          if (!retryData?.session) {
            setError('No active password recovery session found. Please request a new reset link.');
          }
        }, 1200);
      }
    }
    checkSession();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setSuccess('Password updated successfully! Redirecting to login...');
      setLoading(false);
      setTimeout(() => {
        navigate('/admin/login');
      }, 3000);
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
          <h1 className="login-title">Reset Password</h1>
          <p className="login-subtitle">Enter your new secure password below</p>
        </div>

        {success ? (
          <div className="login-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' }}>
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        ) : (
          <form onSubmit={handleReset} className="login-form">
            <div className="login-field">
              <label className="login-label" htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                className="login-input"
                placeholder="New Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                className="login-input"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="login-error" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <><Loader2 size={18} className="spin-icon" /> Updating...</>
              ) : (
                <><Key size={18} /> Update Password</>
              )}
            </button>
          </form>
        )}
      </div>

      <p className="login-footer">
        Access restricted to authorised users only
      </p>

      <style>{`
        /* Match AdminLogin visual styles */
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
