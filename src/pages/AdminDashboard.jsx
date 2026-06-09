import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Search, Download, RefreshCw, ChevronDown, ChevronUp,
  Users, Star, CalendarCheck, TrendingUp, X, Copy, Check, Phone, Mail
} from 'lucide-react';
import { supabase } from '../supabase';
import './AdminDashboard.css';

/* ─── helpers ──────────────────────────────── */
const STATUS_OPTIONS = ['New', 'Contacted', 'Booked', 'Closed'];

const STATUS_STYLE = {
  New:       { bg: '#fff8e6', color: '#b45309', border: '#fde68a' },
  Contacted: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  Booked:    { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
  Closed:    { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
};

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function fmtShort(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function exportCSV(rows) {
  const headers = [
    'Date', 'First Name', 'Last Name', 'Email', 'Phone', 'Country',
    'Primary Financial Goal', 'Current Situation', 'Wealth Challenge',
    'Meaning of Wealth', '1-3yr Goal', 'Monthly Save/Invest',
    'Willing (5 Sessions)', 'Ready ($4,675)', 'Status', 'Notes'
  ];
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csvRows = rows.map(r => [
    fmt(r.created_at), r.first_name, r.last_name, r.email, r.phone, r.country,
    r.primary_financial_goal, r.current_financial_situation, r.wealth_mindset_challenge,
    r.wealth_meaning, r.wealth_goal_1_3_years, r.monthly_save_invest,
    r.willing_to_follow_5_sessions, r.investment_ready_usd4675, r.status, r.notes
  ].map(escape).join(','));
  const csv = [headers.map(escape).join(','), ...csvRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `m2w-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── sub-components ────────────────────────── */
function StatCard({ icon, label, value, accent }) {
  const Icon = icon;
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${accent}18`, color: accent }}>
        <Icon size={20} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.New;
  return (
    <span className="status-badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {status || 'New'}
    </span>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text || '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button className="icon-btn" onClick={copy} title="Copy">
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

function DetailPanel({ row, onClose, onStatusChange, onNotesChange }) {
  const [notes, setNotes] = useState(row.notes || '');
  const [saving, setSaving] = useState(false);

  const saveNotes = async () => {
    setSaving(true);
    await supabase.from('form_submissions').update({ notes }).eq('id', row.id);
    onNotesChange(row.id, notes);
    setSaving(false);
  };

  const fields = [
    { label: 'Country', value: row.country },
    { label: 'Primary Financial Goal', value: row.primary_financial_goal },
    { label: 'Current Situation', value: row.current_financial_situation },
    { label: 'Wealth Challenge', value: row.wealth_mindset_challenge },
    { label: 'Meaning of Wealth', value: row.wealth_meaning },
    { label: '1–3 Year Wealth Goal', value: row.wealth_goal_1_3_years },
    { label: 'Monthly Save / Invest', value: row.monthly_save_invest },
    { label: 'Willing (5 Sessions)', value: row.willing_to_follow_5_sessions },
    { label: 'Ready to Invest $4,675', value: row.investment_ready_usd4675 },
    { label: 'Submitted', value: fmt(row.created_at) },
  ];

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="detail-header">
          <div>
            <h2 className="detail-name">{row.first_name} {row.last_name}</h2>
            <div className="detail-contact-row">
              <Mail size={13} />
              <a href={`mailto:${row.email}`} className="detail-link">{row.email}</a>
              <CopyBtn text={row.email} />
              {row.phone && (
                <>
                  <span className="detail-sep">·</span>
                  <Phone size={13} />
                  <span>{row.phone}</span>
                  <CopyBtn text={row.phone} />
                </>
              )}
            </div>
          </div>
          <button className="icon-btn close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="detail-status-row">
          <span className="detail-section-title">Status</span>
          <div className="status-select-group">
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                className={`status-opt-btn ${(row.status || 'New') === s ? 'active' : ''}`}
                style={(row.status || 'New') === s ? {
                  background: STATUS_STYLE[s].bg,
                  color: STATUS_STYLE[s].color,
                  border: `1.5px solid ${STATUS_STYLE[s].border}`
                } : {}}
                onClick={() => onStatusChange(row.id, s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="detail-fields">
          {fields.map(f => (
            <div key={f.label} className="detail-field">
              <span className="detail-field-label">{f.label}</span>
              <span className="detail-field-value">{f.value || '—'}</span>
            </div>
          ))}
        </div>

        <div className="detail-notes-section">
          <span className="detail-section-title">Notes</span>
          <textarea
            className="detail-notes"
            placeholder="Add notes about this lead..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
          <button className="save-notes-btn" onClick={saveNotes} disabled={saving}>
            {saving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── main dashboard ────────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedRow, setSelectedRow] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  /* fetch */
  const fetchData = async () => {
    if (!supabase) return;
    setRefreshing(true);
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: sortDir === 'asc' });
    if (!error && data) setSubmissions(data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchData(); }, [sortDir]); // eslint-disable-line

  /* auth user info */
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email || '');
    });
  }, []);

  /* real-time subscription */
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel('form_submissions_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'form_submissions' }, (payload) => {
        setSubmissions(prev => sortDir === 'desc' ? [payload.new, ...prev] : [...prev, payload.new]);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [sortDir]);

  /* actions */
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const updateStatus = async (id, status) => {
    await supabase.from('form_submissions').update({ status }).eq('id', id);
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    if (selectedRow?.id === id) setSelectedRow(prev => ({ ...prev, status }));
  };

  const updateNotes = (id, notes) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, notes } : s));
    if (selectedRow?.id === id) setSelectedRow(prev => ({ ...prev, notes }));
  };

  /* computed */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return submissions.filter(s => {
      const matchSearch = !q ||
        `${s.first_name} ${s.last_name} ${s.email} ${s.country} ${s.phone}`.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || (s.status || 'New') === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [submissions, search, statusFilter]);

  const stats = useMemo(() => ({
    total: submissions.length,
    newLeads: submissions.filter(s => (s.status || 'New') === 'New').length,
    booked: submissions.filter(s => s.status === 'Booked').length,
    ready: submissions.filter(s => s.investment_ready_usd4675 === 'Yes').length,
  }), [submissions]);

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="dash-spinner" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="dash-root">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="sidebar-brand">
          <img src="/M2W-favicon.svg" alt="Logo" className="sidebar-logo" />
          <div>
            <div className="sidebar-title">Mindset 2 Wealth</div>
            <div className="sidebar-sub">Admin Dashboard</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-item active">
            <Users size={18} />
            <span>Submissions</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{userEmail?.[0]?.toUpperCase() || 'A'}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-email">{userEmail || 'Admin'}</div>
              <div className="sidebar-user-role">Administrator</div>
            </div>
          </div>
          <button className="sidebar-signout" onClick={handleSignOut} title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <div className="dash-topbar">
          <div>
            <h1 className="dash-heading">Lead Submissions</h1>
            <p className="dash-subheading">Manage and track all Wealth Roadmap form leads</p>
          </div>
          <div className="dash-topbar-actions">
            <button className="dash-icon-btn" onClick={fetchData} title="Refresh" disabled={refreshing}>
              <RefreshCw size={16} className={refreshing ? 'spin-icon' : ''} />
            </button>
            <button className="dash-export-btn" onClick={() => exportCSV(filtered)}>
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard icon={Users}        label="Total Leads"       value={stats.total}    accent="#0F3D2E" />
          <StatCard icon={Star}         label="New Leads"         value={stats.newLeads} accent="#b45309" />
          <StatCard icon={CalendarCheck}label="Booked Calls"      value={stats.booked}   accent="#7c3aed" />
          <StatCard icon={TrendingUp}   label="Ready to Invest"   value={stats.ready}    accent="#15803d" />
        </div>

        {/* Filters */}
        <div className="table-controls">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              id="lead-search"
              type="text"
              className="search-input"
              placeholder="Search name, email, country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}><X size={14} /></button>
            )}
          </div>

          <div className="status-filters">
            {['All', ...STATUS_OPTIONS].map(s => (
              <button
                key={s}
                className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="sort-toggle">
            <button className="dash-icon-btn" onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')} title="Toggle sort order">
              {sortDir === 'desc' ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              {sortDir === 'desc' ? 'Newest' : 'Oldest'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-card">
          {filtered.length === 0 ? (
            <div className="table-empty">
              <Users size={40} style={{ color: '#cbd5e1' }} />
              <p>No submissions found</p>
              {(search || statusFilter !== 'All') && (
                <button className="filter-btn active" onClick={() => { setSearch(''); setStatusFilter('All'); }}>
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="table-scroll">
              <table className="submissions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Country</th>
                    <th>Financial Goal</th>
                    <th>1-3yr Goal</th>
                    <th>Ready ($4,675)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(row => (
                    <tr key={row.id} className="table-row" onClick={() => setSelectedRow(row)}>
                      <td className="td-date">{fmtShort(row.created_at)}</td>
                      <td className="td-name">
                        <span className="name-pill">{row.first_name?.[0]}{row.last_name?.[0]}</span>
                        {row.first_name} {row.last_name}
                      </td>
                      <td className="td-email">
                        <div className="cell-with-copy">
                          <span className="truncate">{row.email}</span>
                          <CopyBtn text={row.email} />
                        </div>
                      </td>
                      <td>{row.phone || '—'}</td>
                      <td>{row.country || '—'}</td>
                      <td className="truncate-cell">{row.primary_financial_goal || '—'}</td>
                      <td className="truncate-cell">{row.wealth_goal_1_3_years || '—'}</td>
                      <td>
                        <span className={`yes-no-badge ${row.investment_ready_usd4675 === 'Yes' ? 'yes' : 'no'}`}>
                          {row.investment_ready_usd4675 || '—'}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          className="status-select"
                          value={row.status || 'New'}
                          onChange={(e) => updateStatus(row.id, e.target.value)}
                          style={{ color: STATUS_STYLE[row.status || 'New']?.color }}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="table-footer">
          Showing {filtered.length} of {submissions.length} submissions
        </div>
      </main>

      {/* Detail Panel */}
      {selectedRow && (
        <DetailPanel
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
          onStatusChange={updateStatus}
          onNotesChange={updateNotes}
        />
      )}
    </div>
  );
}
