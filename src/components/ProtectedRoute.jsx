import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      if (!supabase) {
        if (!cancelled) setSession(null);
        return;
      }
      const { data: { session: s } } = await supabase.auth.getSession();
      if (!cancelled) setSession(s);
    };
    init();

    const sub = supabase?.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => {
      cancelled = true;
      sub?.data?.subscription?.unsubscribe();
    };
  }, []);

  if (session === undefined) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', background: '#f8f9fa', flexDirection: 'column', gap: 16
      }}>
        <div style={{
          width: 40, height: 40, border: '3px solid #e9ecef',
          borderTop: '3px solid #0F3D2E', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ color: '#6c757d', fontSize: 14 }}>Loading...</span>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
