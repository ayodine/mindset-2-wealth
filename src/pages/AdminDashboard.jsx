import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Search, Download, RefreshCw, ChevronDown, ChevronUp,
  Users, Star, CalendarCheck, TrendingUp, X, Copy, Check, Phone, Mail, Link as LinkIcon, MapPin, Briefcase, Trash2, Settings, Plus
} from 'lucide-react';
import { supabase } from '../supabase';
import { roadmapQuestions, workshopQuestions } from '../questions';
import './AdminDashboard.css';

/* ─── helpers ──────────────────────────────── */
const STATUS_OPTIONS = ['New', 'Contacted', 'Booked', 'Closed'];

const STATUS_STYLE = {
  New:       { bg: '#fff8e6', color: '#b45309', border: '#fde68a' },
  Contacted: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  Booked:    { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
  Closed:    { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
};

const ROADMAP_COLUMN_MAP = {
  country: { qId: 'q1' },
  primary_financial_goal: { qId: 'q2' },
  current_financial_situation: { qId: 'q3' },
  wealth_mindset_challenge: { qId: 'q4' },
  wealth_meaning: { qId: 'q5' },
  wealth_goal_1_3_years: { qId: 'q6' },
  monthly_save_invest: { qId: 'q7' },
  willing_to_follow_5_sessions: { qId: 'q8' },
  investment_ready_usd4675: { qId: 'q9' },
  first_name: { qId: 'q10', fieldId: 'firstName' },
  last_name: { qId: 'q10', fieldId: 'lastName' },
  email: { qId: 'q10', fieldId: 'email' },
  phone: { qId: 'q10', fieldId: 'phone' }
};

const WORKSHOP_COLUMN_MAP = {
  full_name: { qId: 'w1', fieldId: 'fullName' },
  organization_name: { qId: 'w1', fieldId: 'organizationName' },
  job_title: { qId: 'w1', fieldId: 'jobTitle' },
  email: { qId: 'w2', fieldId: 'email' },
  website_link: { qId: 'w2', fieldId: 'websiteLink' },
  location: { qId: 'w6' },
  expected_attendees: { qId: 'w7' },
  session_type: { qId: 'w8' },
  topics: { qId: 'w9' },
  format: { qId: 'w10' },
  event_date_time: { qId: 'w11' },
  has_budget: { qId: 'w12' },
  audience_struggles: { qId: 'w13' },
  success_outcome: { qId: 'w14' },
  referral_source: { qId: 'w15' }
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

function exportRoadmapCSV(rows) {
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
  a.download = `m2w-roadmap-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportWorkshopCSV(rows) {
  const headers = [
    'Date', 'Full Name', 'Organization/Institution', 'Job Title/Role', 'Email', 'Website/Link', 'Location',
    'Expected Attendees', 'Session Type', 'Topics interested', 'Preferred Format',
    'Date & Time of Event', 'Budget Allocated', 'Audience Struggles', 'Success Outcome', 'How They Heard', 'Status', 'Notes'
  ];
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csvRows = rows.map(r => [
    fmt(r.created_at), r.full_name, r.organization_name, r.job_title, r.email, r.website_link, r.location,
    r.expected_attendees, r.session_type, r.topics ? r.topics.join(', ') : '', r.format,
    r.event_date_time, r.has_budget, r.audience_struggles, r.success_outcome, r.referral_source, r.status, r.notes
  ].map(escape).join(','));
  const csv = [headers.map(escape).join(','), ...csvRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `m2w-workshop-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
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

function DetailPanel({ row, activeTab, questions, onClose, onStatusChange, onNotesChange, onDelete }) {
  const [notes, setNotes] = useState(row.notes || '');
  const [saving, setSaving] = useState(false);

  const tableName = activeTab === 'roadmap' ? 'form_submissions' : 'workshop_submissions';

  const saveNotes = async () => {
    setSaving(true);
    await supabase.from(tableName).update({ notes }).eq('id', row.id);
    onNotesChange(row.id, notes);
    setSaving(false);
  };

  const getDynamicFields = () => {
    const colMap = activeTab === 'roadmap' ? ROADMAP_COLUMN_MAP : WORKSHOP_COLUMN_MAP;
    const questionsList = questions || (activeTab === 'roadmap' ? roadmapQuestions : workshopQuestions);

    const fieldsList = Object.entries(colMap).map(([colKey, mapping]) => {
      const { qId, fieldId } = mapping;
      const question = questionsList.find(q => q.id === qId);
      
      let label = colKey.replace(/_/g, ' ');
      label = label.charAt(0).toUpperCase() + label.slice(1);

      if (question) {
        if (fieldId && question.fields) {
          const subField = question.fields.find(f => f.id === fieldId);
          if (subField) {
            label = subField.label;
          }
        } else {
          label = question.title;
        }
      }

      let displayVal = row[colKey];
      if (Array.isArray(displayVal)) {
        displayVal = displayVal.join(', ');
      }

      return { label, value: displayVal, key: colKey };
    });

    fieldsList.push({ label: 'Submitted', value: fmt(row.created_at), key: 'created_at' });
    return fieldsList;
  };

  const fields = getDynamicFields();

  const displayName = activeTab === 'roadmap'
    ? `${row.first_name || ''} ${row.last_name || ''}`
    : row.full_name;

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="detail-header">
          <div>
            <h2 className="detail-name">{displayName || 'Anonymous'}</h2>
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
            <div key={f.key || f.label} className="detail-field" style={f.key === 'audience_struggles' || f.key === 'success_outcome' || f.key === 'topics' || f.key === 'wealth_mindset_challenge' ? { gridColumn: 'span 2' } : {}}>
              <span className="detail-field-label">{f.label}</span>
              <span className="detail-field-value" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{f.value || '—'}</span>
            </div>
          ))}
        </div>

        <div className="detail-notes-section">
          <span className="detail-section-title">Notes</span>
          <textarea
            className="detail-notes"
            placeholder="Add notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
          <button className="save-notes-btn" onClick={saveNotes} disabled={saving}>
            {saving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>

        <div className="detail-delete-section">
          <button className="delete-submission-btn" onClick={() => onDelete(row.id)}>
            <Trash2 size={16} />
            <span>Delete Submission</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── FormEditor component ──────────────────── */
function FormEditor({ roadmapQ, workshopQ, onSaveRoadmap, onSaveWorkshop }) {
  const [selectedForm, setSelectedForm] = useState('roadmap');
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const initialQ = selectedForm === 'roadmap' ? roadmapQ : workshopQ;
    setQuestions(JSON.parse(JSON.stringify(initialQ)));
    setMessage(null);
  }, [selectedForm, roadmapQ, workshopQ]);

  const handleTitleChange = (idx, newTitle) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, title: newTitle } : q));
  };

  const handleRequiredToggle = (idx) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, required: !q.required } : q));
  };

  const handleOptionChange = (qIdx, optIdx, newVal) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i === qIdx) {
        const newOpts = [...q.options];
        newOpts[optIdx] = newVal;
        return { ...q, options: newOpts };
      }
      return q;
    }));
  };

  const handleAddOption = (qIdx) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i === qIdx) {
        return { ...q, options: [...(q.options || []), 'New Option'] };
      }
      return q;
    }));
  };

  const handleRemoveOption = (qIdx, optIdx) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i === qIdx) {
        return { ...q, options: q.options.filter((_, oIdx) => oIdx !== optIdx) };
      }
      return q;
    }));
  };

  const handleFieldLabelChange = (qIdx, fieldIdx, newLabel) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i === qIdx && q.fields) {
        const newFields = q.fields.map((f, fIdx) => fIdx === fieldIdx ? { ...f, label: newLabel } : f);
        return { ...q, fields: newFields };
      }
      return q;
    }));
  };

  const handleSave = async () => {
    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase credentials missing. Cannot save changes.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from('form_questions')
        .upsert({ id: selectedForm, questions });

      if (error) throw error;

      if (selectedForm === 'roadmap') {
        onSaveRoadmap(questions);
      } else {
        onSaveWorkshop(questions);
      }

      setMessage({ type: 'success', text: 'Questions saved successfully! Changes are now live.' });
    } catch (err) {
      console.error('Failed to save questions:', err);
      setMessage({ type: 'error', text: 'Failed to save questions: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm("Are you sure you want to reset this form's questions to the default settings? Unsaved changes will be lost.")) {
      const defaultQ = selectedForm === 'roadmap' ? roadmapQuestions : workshopQuestions;
      setQuestions(JSON.parse(JSON.stringify(defaultQ)));
    }
  };

  return (
    <div className="editor-card">
      <div className="editor-header-bar">
        <div className="form-toggle-buttons">
          <button 
            className={`form-toggle-btn ${selectedForm === 'roadmap' ? 'active' : ''}`}
            onClick={() => setSelectedForm('roadmap')}
          >
            Wealth Roadmap Form
          </button>
          <button 
            className={`form-toggle-btn ${selectedForm === 'workshop' ? 'active' : ''}`}
            onClick={() => setSelectedForm('workshop')}
          >
            Workshop Inquiry Form
          </button>
        </div>

        <div className="editor-actions">
          <button className="reset-btn" onClick={handleResetToDefault}>
            Reset to Defaults
          </button>
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`editor-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="questions-editor-list">
        {questions.map((q, qIdx) => {
          const hasOptions = ['dropdown', 'multiple_choice', 'checkboxes'].includes(q.type);
          return (
            <div key={q.id} className="editor-question-card">
              <div className="card-header">
                <div>
                  <span className="card-number">Q{qIdx + 1}</span>
                  <span className="card-type-badge">{q.type}</span>
                  <span className="card-id-label">ID: {q.id}</span>
                </div>
                
                <label className="required-toggle-label">
                  <input 
                    type="checkbox" 
                    checked={!!q.required} 
                    onChange={() => handleRequiredToggle(qIdx)}
                  />
                  <span>Required</span>
                </label>
              </div>

              <div className="card-body">
                <div className="input-group">
                  <label className="input-label">Question Text</label>
                  <input 
                    type="text" 
                    className="card-title-input" 
                    value={q.title} 
                    onChange={(e) => handleTitleChange(qIdx, e.target.value)}
                  />
                </div>

                {hasOptions && (
                  <div className="options-editor-section">
                    <label className="input-label">Answer Options</label>
                    <div className="options-list">
                      {q.options?.map((opt, optIdx) => (
                        <div key={optIdx} className="option-row">
                          <input 
                            type="text" 
                            className="option-input" 
                            value={opt} 
                            onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                          />
                          <button 
                            className="remove-opt-btn" 
                            onClick={() => handleRemoveOption(qIdx, optIdx)}
                            title="Remove Option"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="add-opt-btn" onClick={() => handleAddOption(qIdx)}>
                      + Add Option
                    </button>
                  </div>
                )}

                {q.type === 'contact_group' && q.fields && (
                  <div className="fields-editor-section">
                    <label className="input-label">Contact Group Fields</label>
                    <div className="fields-list">
                      {q.fields.map((f, fIdx) => (
                        <div key={f.id} className="field-row">
                          <span className="field-id-badge">{f.id} ({f.type})</span>
                          <input 
                            type="text" 
                            className="field-label-input" 
                            value={f.label} 
                            onChange={(e) => handleFieldLabelChange(qIdx, fIdx, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── main dashboard ────────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap', 'workshop', or 'editor'
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedRow, setSelectedRow] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Questions State
  const [roadmapQ, setRoadmapQ] = useState(roadmapQuestions);
  const [workshopQ, setWorkshopQ] = useState(workshopQuestions);

  const tableName = activeTab === 'roadmap' ? 'form_submissions' : 'workshop_submissions';

  /* fetch submissions */
  const fetchData = async () => {
    if (!supabase || activeTab === 'editor') return;
    setRefreshing(true);
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: sortDir === 'asc' });
    if (!error && data) setSubmissions(data);
    setLoading(false);
    setRefreshing(false);
  };

  /* fetch questions & initialize if needed */
  useEffect(() => {
    async function loadQuestions() {
      if (!supabase) return;
      try {
        const { data } = await supabase.from('form_questions').select('*');
        let currentRoadmapQ = null;
        let currentWorkshopQ = null;

        if (data) {
          const r = data.find(item => item.id === 'roadmap');
          const w = data.find(item => item.id === 'workshop');
          if (r?.questions) currentRoadmapQ = r.questions;
          if (w?.questions) currentWorkshopQ = w.questions;
        }

        const updates = [];
        if (!currentRoadmapQ) {
          currentRoadmapQ = roadmapQuestions;
          updates.push({ id: 'roadmap', questions: roadmapQuestions });
        }
        if (!currentWorkshopQ) {
          currentWorkshopQ = workshopQuestions;
          updates.push({ id: 'workshop', questions: workshopQuestions });
        }

        if (updates.length > 0) {
          await supabase.from('form_questions').upsert(updates);
        }

        setRoadmapQ(currentRoadmapQ);
        setWorkshopQ(currentWorkshopQ);
      } catch (err) {
        console.warn('Failed to load/initialize dynamic questions:', err);
      }
    }
    loadQuestions();
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      await Promise.resolve();
      if (active && activeTab !== 'editor') {
        fetchData();
        setSelectedRow(null); // Clear selected row on tab/sort change
      }
    };
    run();
    return () => { active = false; };
  }, [activeTab, sortDir]); // eslint-disable-line

  /* auth user info */
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email || '');
    });
  }, []);

  /* real-time subscription */
  useEffect(() => {
    if (!supabase || activeTab === 'editor') return;
    const channel = supabase
      .channel(`${tableName}_realtime`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: tableName }, (payload) => {
        setSubmissions(prev => sortDir === 'desc' ? [payload.new, ...prev] : [...prev, payload.new]);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [activeTab, sortDir, tableName]);

  /* actions */
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const updateStatus = async (id, status) => {
    await supabase.from(tableName).update({ status }).eq('id', id);
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    if (selectedRow?.id === id) setSelectedRow(prev => ({ ...prev, status }));
  };

  const updateNotes = (id, notes) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, notes } : s));
    if (selectedRow?.id === id) setSelectedRow(prev => ({ ...prev, notes }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission? This action cannot be undone.")) return;
    try {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      setSubmissions(prev => prev.filter(s => s.id !== id));
      setSelectedRow(null);
    } catch (err) {
      alert("Failed to delete submission: " + err.message);
    }
  };

  /* computed filtered submissions */
  const filtered = useMemo(() => {
    if (activeTab === 'editor') return [];
    const q = search.toLowerCase();
    return submissions.filter(s => {
      let matchSearch = true;
      if (q) {
        if (activeTab === 'roadmap') {
          matchSearch = `${s.first_name || ''} ${s.last_name || ''} ${s.email || ''} ${s.country || ''} ${s.phone || ''}`.toLowerCase().includes(q);
        } else {
          matchSearch = `${s.full_name || ''} ${s.organization_name || ''} ${s.email || ''} ${s.location || ''} ${s.job_title || ''}`.toLowerCase().includes(q);
        }
      }
      const matchStatus = statusFilter === 'All' || (s.status || 'New') === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [submissions, search, statusFilter, activeTab]);

  /* dynamic stats based on tab */
  const stats = useMemo(() => {
    if (activeTab === 'editor') return {};
    const total = submissions.length;
    const newLeads = submissions.filter(s => (s.status || 'New') === 'New').length;

    if (activeTab === 'roadmap') {
      return {
        total,
        newLeads,
        metricLabel: 'Booked Calls',
        metricValue: submissions.filter(s => s.status === 'Booked').length,
        extraLabel: 'Ready to Invest',
        extraValue: submissions.filter(s => s.investment_ready_usd4675 === 'Yes').length,
      };
    } else {
      return {
        total,
        newLeads,
        metricLabel: 'Budget Allocated',
        metricValue: submissions.filter(s => s.has_budget === 'Yes').length,
        extraLabel: 'In-Person / Hybrid',
        extraValue: submissions.filter(s => s.format === 'In-Person' || s.format === 'Hybrid').length,
      };
    }
  }, [submissions, activeTab]);

  const handleExport = () => {
    if (activeTab === 'roadmap') {
      exportRoadmapCSV(filtered);
    } else {
      exportWorkshopCSV(filtered);
    }
  };

  if (loading && activeTab !== 'editor') {
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
          <div className="sidebar-section-title">Leads Management</div>
          <button 
            className={`sidebar-nav-item ${activeTab === 'roadmap' ? 'active' : ''}`}
            onClick={() => { setActiveTab('roadmap'); setSearch(''); setStatusFilter('All'); }}
          >
            <Users size={18} />
            <span>Roadmap Leads</span>
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'workshop' ? 'active' : ''}`}
            onClick={() => { setActiveTab('workshop'); setSearch(''); setStatusFilter('All'); }}
          >
            <CalendarCheck size={18} />
            <span>Workshop Inquiries</span>
          </button>

          <div className="sidebar-section-title">Configuration</div>
          <button 
            className={`sidebar-nav-item ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => { setActiveTab('editor'); }}
          >
            <Settings size={18} />
            <span>Edit Questions</span>
          </button>
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

      {/* Main Content */}
      <main className="dash-main">
        {activeTab === 'editor' ? (
          <>
            <div className="dash-topbar">
              <div>
                <h1 className="dash-heading">Edit Questionnaire Forms</h1>
                <p className="dash-subheading">Customize the questions, fields, and options visible on the client-facing forms.</p>
              </div>
            </div>

            <FormEditor 
              roadmapQ={roadmapQ}
              workshopQ={workshopQ}
              onSaveRoadmap={setRoadmapQ}
              onSaveWorkshop={setWorkshopQ}
            />
          </>
        ) : (
          <>
            <div className="dash-topbar">
              <div>
                <h1 className="dash-heading">
                  {activeTab === 'roadmap' ? 'Wealth Roadmap Leads' : 'Workshop Inquiries'}
                </h1>
                <p className="dash-subheading">
                  {activeTab === 'roadmap' 
                    ? 'Manage and track all Wealth Roadmap form leads' 
                    : 'Review corporate and institutional financial wellness inquiries'}
                </p>
              </div>
              <div className="dash-topbar-actions">
                <button className="dash-icon-btn" onClick={fetchData} title="Refresh" disabled={refreshing}>
                  <RefreshCw size={16} className={refreshing ? 'spin-icon' : ''} />
                </button>
                <button className="dash-export-btn" onClick={handleExport}>
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <StatCard icon={Users}        label={activeTab === 'roadmap' ? 'Total Leads' : 'Total Inquiries'} value={stats.total}    accent="#0F3D2E" />
              <StatCard icon={Star}         label={activeTab === 'roadmap' ? 'New Leads' : 'New Inquiries'}     value={stats.newLeads} accent="#b45309" />
              <StatCard icon={activeTab === 'roadmap' ? CalendarCheck : TrendingUp} label={stats.metricLabel}   value={stats.metricValue} accent="#7c3aed" />
              <StatCard icon={activeTab === 'roadmap' ? TrendingUp : MapPin}        label={stats.extraLabel}    value={stats.extraValue}  accent="#15803d" />
            </div>

            {/* Table Controls */}
            <div className="table-controls">
              <div className="search-wrapper">
                <Search size={16} className="search-icon" />
                <input
                  id="lead-search"
                  type="text"
                  className="search-input"
                  placeholder={activeTab === 'roadmap' ? "Search name, email, country..." : "Search name, organization, location..."}
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

            {/* Table Card */}
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
                      {activeTab === 'roadmap' ? (
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
                      ) : (
                        <tr>
                          <th>Date</th>
                          <th>Full Name</th>
                          <th>Organization</th>
                          <th>Job Title</th>
                          <th>Email</th>
                          <th>Location</th>
                          <th>Session Type</th>
                          <th>Format</th>
                          <th>Budget?</th>
                          <th>Status</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {filtered.map(row => {
                        const displayName = activeTab === 'roadmap'
                          ? `${row.first_name || ''} ${row.last_name || ''}`
                          : row.full_name;

                        const avatarInitials = activeTab === 'roadmap'
                          ? `${row.first_name?.[0] || ''}${row.last_name?.[0] || ''}`.toUpperCase()
                          : (row.full_name?.split(' ').map(n => n[0]).join('') || '').slice(0, 2).toUpperCase();

                        return (
                          <tr key={row.id} className="table-row" onClick={() => setSelectedRow(row)}>
                            <td className="td-date">{fmtShort(row.created_at)}</td>
                            <td className="td-name">
                              <span className="name-pill">{avatarInitials || 'U'}</span>
                              {displayName || 'Anonymous'}
                            </td>
                            
                            {activeTab === 'roadmap' ? (
                              <>
                                <td className="td-email">
                                  <div className="cell-with-copy">
                                    <span className="truncate">{row.email}</span>
                                    <CopyBtn text={row.email} />
                                  </div>
                                </td>
                                <td>{row.phone || '—'}</td>
                                <td>{row.country || '—'}</td>
                                <td className="truncate-cell" title={row.primary_financial_goal}>{row.primary_financial_goal || '—'}</td>
                                <td className="truncate-cell" title={row.wealth_goal_1_3_years}>{row.wealth_goal_1_3_years || '—'}</td>
                                <td>
                                  <span className={`yes-no-badge ${row.investment_ready_usd4675 === 'Yes' ? 'yes' : 'no'}`}>
                                    {row.investment_ready_usd4675 || '—'}
                                  </span>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="truncate-cell" title={row.organization_name}>{row.organization_name || '—'}</td>
                                <td className="truncate-cell" title={row.job_title}>{row.job_title || '—'}</td>
                                <td className="td-email">
                                  <div className="cell-with-copy">
                                    <span className="truncate">{row.email}</span>
                                    <CopyBtn text={row.email} />
                                  </div>
                                </td>
                                <td>{row.location || '—'}</td>
                                <td className="truncate-cell" title={row.session_type}>{row.session_type || '—'}</td>
                                <td>{row.format || '—'}</td>
                                <td>
                                  <span className={`yes-no-badge ${row.has_budget === 'Yes' ? 'yes' : row.has_budget === 'No' ? 'no' : 'New'}`}>
                                    {row.has_budget || '—'}
                                  </span>
                                </td>
                              </>
                            )}
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="table-footer">
              Showing {filtered.length} of {submissions.length} submissions
            </div>
          </>
        )}
      </main>

      {/* Detail Panel */}
      {selectedRow && (
        <DetailPanel
          row={selectedRow}
          activeTab={activeTab}
          questions={activeTab === 'roadmap' ? roadmapQ : workshopQ}
          onClose={() => setSelectedRow(null)}
          onStatusChange={updateStatus}
          onNotesChange={updateNotes}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
