import React, { useState, useEffect } from "react";

// ─── Inline styles ────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body, #root {
    font-family: 'DM Sans', sans-serif;
    background: #0f1117;
    color: #e2e8f0;
    min-height: 100vh;
  }

  .admin-shell {
    display: flex;
    min-height: 100vh;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 220px;
    background: #141820;
    border-right: 1px solid #1e2432;
    padding: 28px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex-shrink: 0;
  }

  .sidebar-logo {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #6c8ef5;
    padding: 0 8px 20px;
    border-bottom: 1px solid #1e2432;
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 400;
    color: #7a869a;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    text-decoration: none;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
  }

  .sidebar-item:hover { background: #1b2133; color: #c8d0e7; }
  .sidebar-item.active { background: #1a2340; color: #6c8ef5; font-weight: 500; }

  .sidebar-icon { font-size: 15px; flex-shrink: 0; }

  /* ── Main ── */
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 32px;
    border-bottom: 1px solid #1e2432;
    background: #141820;
  }

  .topbar-title {
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #c8d0e7;
    text-transform: uppercase;
  }

  .topbar-sub {
    font-size: 12px;
    color: #4a5568;
    margin-top: 2px;
  }

  .page-body {
    padding: 28px 32px;
    flex: 1;
    overflow-y: auto;
  }

  /* ── Stats row ── */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: #141820;
    border: 1px solid #1e2432;
    border-radius: 10px;
    padding: 16px 18px;
  }

  .stat-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #4a5568;
    margin-bottom: 6px;
  }

  .stat-value {
    font-family: 'Space Mono', monospace;
    font-size: 22px;
    font-weight: 700;
    color: #e2e8f0;
  }

  .stat-delta {
    font-size: 11px;
    margin-top: 4px;
  }

  .delta-up { color: #48bb78; }
  .delta-down { color: #fc8181; }

  /* ── Toolbar ── */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
  }

  .search-wrap {
    position: relative;
    flex: 1;
    max-width: 320px;
  }

  .search-icon {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: #4a5568;
    font-size: 14px;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    background: #141820;
    border: 1px solid #1e2432;
    border-radius: 8px;
    padding: 9px 12px 9px 34px;
    font-size: 13px;
    color: #c8d0e7;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s;
  }

  .search-input::placeholder { color: #4a5568; }
  .search-input:focus { border-color: #6c8ef5; }

  .filter-select {
    background: #141820;
    border: 1px solid #1e2432;
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 13px;
    color: #7a869a;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    cursor: pointer;
  }

  .btn-add {
    margin-left: auto;
    background: #6c8ef5;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 9px 18px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 7px;
    transition: background 0.15s, transform 0.1s;
  }

  .btn-add:hover { background: #5a7de0; }
  .btn-add:active { transform: scale(0.97); }

  /* ── Table ── */
  .table-card {
    background: #141820;
    border: 1px solid #1e2432;
    border-radius: 12px;
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
  }

  thead {
    background: #0f1117;
    border-bottom: 1px solid #1e2432;
  }

  th {
    padding: 12px 18px;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #4a5568;
  }

  td {
    padding: 14px 18px;
    border-bottom: 1px solid #1a2030;
    vertical-align: middle;
    color: #c8d0e7;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #161d2b; }

  .avatar-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .user-name {
    font-weight: 500;
    color: #e2e8f0;
    font-size: 13.5px;
  }

  .user-email {
    font-size: 11.5px;
    color: #4a5568;
    margin-top: 1px;
  }

  /* Role badge */
  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: capitalize;
  }

  .badge-admin    { background: #1a2340; color: #6c8ef5; border: 1px solid #2a3560; }
  .badge-editor   { background: #1a3030; color: #4fd1c5; border: 1px solid #2a4040; }
  .badge-viewer   { background: #1e2432; color: #7a869a; border: 1px solid #2a3040; }
  .badge-manager  { background: #2d1a30; color: #d08aff; border: 1px solid #401a50; }

  /* Status dot */
  .status-dot {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12.5px;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .dot-active   { background: #48bb78; box-shadow: 0 0 6px #48bb7855; }
  .dot-inactive { background: #4a5568; }
  .dot-pending  { background: #ecc94b; box-shadow: 0 0 6px #ecc94b55; }

  /* Actions */
  .action-btns { display: flex; gap: 6px; }

  .btn-icon {
    background: #1b2133;
    border: 1px solid #1e2432;
    border-radius: 7px;
    padding: 6px 10px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    color: #7a869a;
    font-family: 'DM Sans', sans-serif;
  }

  .btn-icon:hover { background: #202840; border-color: #2a3560; color: #6c8ef5; }

  .btn-icon.danger:hover { background: #2d1515; border-color: #5c2020; color: #fc8181; }

  /* Pagination */
  .pagination-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-top: 1px solid #1e2432;
    font-size: 12px;
    color: #4a5568;
  }

  .page-btns { display: flex; gap: 6px; }

  .page-btn {
    background: #1b2133;
    border: 1px solid #1e2432;
    border-radius: 6px;
    padding: 5px 11px;
    font-size: 12px;
    color: #7a869a;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }

  .page-btn:hover { background: #202840; color: #6c8ef5; }
  .page-btn.active { background: #6c8ef5; color: #fff; border-color: #6c8ef5; }

  /* ── Modal Overlay ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    backdrop-filter: blur(3px);
  }

  .modal-box {
    background: #141820;
    border: 1px solid #2a3560;
    border-radius: 14px;
    width: 100%;
    max-width: 480px;
    padding: 28px;
    animation: slideUp 0.2s ease;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .modal-title {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #6c8ef5;
    margin-bottom: 20px;
  }

  .form-group { margin-bottom: 16px; }

  .form-label {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #4a5568;
    margin-bottom: 6px;
  }

  .form-input, .form-select {
    width: 100%;
    background: #0f1117;
    border: 1px solid #1e2432;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 13px;
    color: #c8d0e7;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s;
  }

  .form-input:focus, .form-select:focus { border-color: #6c8ef5; }
  .form-input::placeholder { color: #2d3748; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 24px;
  }

  .btn-cancel {
    background: #1b2133;
    border: 1px solid #1e2432;
    border-radius: 8px;
    padding: 9px 18px;
    font-size: 13px;
    font-weight: 500;
    color: #7a869a;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }

  .btn-cancel:hover { background: #202840; color: #c8d0e7; }

  .btn-save {
    background: #6c8ef5;
    border: none;
    border-radius: 8px;
    padding: 9px 20px;
    font-size: 13px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }

  .btn-save:hover { background: #5a7de0; }

  /* Delete confirm */
  .delete-modal .modal-title { color: #fc8181; }

  .delete-msg {
    font-size: 13.5px;
    color: #7a869a;
    line-height: 1.6;
    margin-bottom: 4px;
  }

  .delete-name {
    color: #e2e8f0;
    font-weight: 600;
  }

  .btn-delete-confirm {
    background: #7b1f1f;
    border: none;
    border-radius: 8px;
    padding: 9px 20px;
    font-size: 13px;
    font-weight: 500;
    color: #fca5a5;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }

  .btn-delete-confirm:hover { background: #991f1f; }

  /* Toast */
  .toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .toast {
    background: #1b2133;
    border: 1px solid #2a3560;
    border-radius: 9px;
    padding: 12px 18px;
    font-size: 13px;
    color: #c8d0e7;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: toastIn 0.25s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    max-width: 300px;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .toast-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* Empty state */
  .empty-state {
    text-align: center;
    padding: 48px 24px;
    color: #4a5568;
  }

  .empty-icon { font-size: 36px; margin-bottom: 12px; opacity: 0.4; }
  .empty-text { font-size: 13px; }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: "#1a2340", color: "#6c8ef5" },
  { bg: "#1a3030", color: "#4fd1c5" },
  { bg: "#2d1a30", color: "#d08aff" },
  { bg: "#1a3020", color: "#68d391" },
  { bg: "#2d2215", color: "#f6ad55" },
];

const getInitials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const getAvatarStyle = (name) => {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const ROLES = ["Admin", "Manager", "Editor", "Viewer"];
const STATUSES = ["Active", "Inactive", "Pending"];

// ─── Default Users ────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: 1, name: "Alexandra Reyes", email: "a.reyes@corp.io", role: "Admin", status: "Active", joined: "Jan 2024", dept: "Engineering" },
  { id: 2, name: "Marcus Tan", email: "m.tan@corp.io", role: "Manager", status: "Active", joined: "Mar 2024", dept: "Product" },
  { id: 3, name: "Priya Nair", email: "p.nair@corp.io", role: "Editor", status: "Pending", joined: "Jun 2024", dept: "Design" },
  { id: 4, name: "Lucas Moreira", email: "l.moreira@corp.io", role: "Viewer", status: "Inactive", joined: "Feb 2024", dept: "Marketing" },
  { id: 5, name: "Hana Fujimoto", email: "h.fujimoto@corp.io", role: "Editor", status: "Active", joined: "Aug 2024", dept: "Engineering" },
  { id: 6, name: "Jordan Blake", email: "j.blake@corp.io", role: "Admin", status: "Active", joined: "Dec 2023", dept: "Leadership" },
];

const BLANK_FORM = { name: "", email: "", role: "Viewer", status: "Active", dept: "" };

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ toasts }) => (
  <div className="toast-container">
    {toasts.map((t) => (
      <div key={t.id} className="toast">
        <div className="toast-dot" style={{ background: t.color }} />
        {t.msg}
      </div>
    ))}
  </div>
);

// ─── User Form Modal ──────────────────────────────────────────────────────────
const UserModal = ({ mode, user, onClose, onSave }) => {
  const [form, setForm] = useState(user || BLANK_FORM);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">{mode === "add" ? "▸ New User" : "▸ Edit User"}</div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Full name *</label>
            <input className="form-input" value={form.name} onChange={set("name")} placeholder="Jane Smith" />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" value={form.email} onChange={set("email")} placeholder="jane@corp.io" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-select" value={form.role} onChange={set("role")}>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={set("status")}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Department</label>
          <input className="form-input" value={form.dept} onChange={set("dept")} placeholder="e.g. Engineering" />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>
            {mode === "add" ? "Create User" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Modal ─────────────────────────────────────────────────────────────
const DeleteModal = ({ user, onClose, onConfirm }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal-box delete-modal">
      <div className="modal-title">▸ Remove User</div>
      <p className="delete-msg">
        You are about to permanently remove{" "}
        <span className="delete-name">{user.name}</span> from the system.
        This action cannot be undone.
      </p>
      <div className="modal-actions" style={{ marginTop: 20 }}>
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-delete-confirm" onClick={onConfirm}>Remove User</button>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // { type: "add"|"edit"|"delete", user? }
  const [toasts, setToasts] = useState([]);
  const PER_PAGE = 5;

  const pushToast = (msg, color = "#48bb78") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, color }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  // Filtered list
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchQ = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchQ && matchRole && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, roleFilter, statusFilter]);

  // Stats
  const total = users.length;
  const active = users.filter((u) => u.status === "Active").length;
  const admins = users.filter((u) => u.role === "Admin").length;
  const pending = users.filter((u) => u.status === "Pending").length;

  // CRUD
  const handleAdd = (form) => {
    const newUser = { ...form, id: Date.now(), joined: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }) };
    setUsers((u) => [newUser, ...u]);
    setModal(null);
    pushToast(`User "${form.name}" created`, "#48bb78");
  };

  const handleEdit = (form) => {
    setUsers((u) => u.map((x) => (x.id === modal.user.id ? { ...x, ...form } : x)));
    setModal(null);
    pushToast(`User "${form.name}" updated`, "#6c8ef5");
  };

  const handleDelete = () => {
    setUsers((u) => u.filter((x) => x.id !== modal.user.id));
    pushToast(`User removed`, "#fc8181");
    setModal(null);
  };

  const roleBadge = (role) => {
    const map = { Admin: "badge-admin", Manager: "badge-manager", Editor: "badge-editor", Viewer: "badge-viewer" };
    return <span className={`badge ${map[role] || "badge-viewer"}`}>{role}</span>;
  };

  const statusDot = (status) => {
    const map = { Active: "dot-active", Inactive: "dot-inactive", Pending: "dot-pending" };
    return (
      <div className="status-dot">
        <div className={`dot ${map[status]}`} />
        {status}
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>

      <div className="admin-shell">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">CTRL · ADM</div>
          {[
            ["◈", "Dashboard"], ["◉", "Users", true], ["◫", "Roles"], ["◬", "Activity"], ["◐", "Settings"],
          ].map(([icon, label, active]) => (
            <button key={label} className={`sidebar-item ${active ? "active" : ""}`}>
              <span className="sidebar-icon">{icon}</span>
              {label}
            </button>
          ))}
        </aside>

        {/* Main */}
        <main className="main-content">
          <div className="topbar">
            <div>
              <div className="topbar-title">User Management</div>
              <div className="topbar-sub">Manage all system accounts and permissions</div>
            </div>
          </div>

          <div className="page-body">
            {/* Stats */}
            <div className="stats-row">
              {[
                { label: "Total Users", value: total, delta: "+2 this month", up: true },
                { label: "Active", value: active, delta: `${Math.round((active / total) * 100)}% of total`, up: true },
                { label: "Admins", value: admins, delta: "Full access", up: true },
                { label: "Pending", value: pending, delta: "Awaiting setup", up: false },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value">{s.value}</div>
                  <div className={`stat-delta ${s.up ? "delta-up" : "delta-down"}`}>{s.delta}</div>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="toolbar">
              <div className="search-wrap">
                <span className="search-icon">⌕</span>
                <input
                  className="search-input"
                  placeholder="Search by name or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select className="filter-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option>All</option>
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>

              <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option>All</option>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>

              <button className="btn-add" onClick={() => setModal({ type: "add" })}>
                + Add User
              </button>
            </div>

            {/* Table */}
            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="empty-state">
                          <div className="empty-icon">◎</div>
                          <div className="empty-text">No users match your filters</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    visible.map((u) => {
                      const av = getAvatarStyle(u.name);
                      return (
                        <tr key={u.id}>
                          <td>
                            <div className="avatar-cell">
                              <div className="avatar" style={{ background: av.bg, color: av.color }}>
                                {getInitials(u.name)}
                              </div>
                              <div>
                                <div className="user-name">{u.name}</div>
                                <div className="user-email">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{roleBadge(u.role)}</td>
                          <td style={{ color: "#7a869a" }}>{u.dept || "—"}</td>
                          <td>{statusDot(u.status)}</td>
                          <td style={{ color: "#4a5568", fontFamily: "'Space Mono', monospace", fontSize: 12 }}>{u.joined}</td>
                          <td>
                            <div className="action-btns">
                              <button className="btn-icon" onClick={() => setModal({ type: "edit", user: u })} title="Edit">✎</button>
                              <button className="btn-icon danger" onClick={() => setModal({ type: "delete", user: u })} title="Delete">✕</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination-row">
                <span>
                  Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div className="page-btns">
                  <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} className={`page-btn ${page === i + 1 ? "active" : ""}`} onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </button>
                  ))}
                  <button className="page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {modal?.type === "add" && (
        <UserModal mode="add" user={null} onClose={() => setModal(null)} onSave={handleAdd} />
      )}
      {modal?.type === "edit" && (
        <UserModal mode="edit" user={modal.user} onClose={() => setModal(null)} onSave={handleEdit} />
      )}
      {modal?.type === "delete" && (
        <DeleteModal user={modal.user} onClose={() => setModal(null)} onConfirm={handleDelete} />
      )}

      <Toast toasts={toasts} />
    </>
  );
}