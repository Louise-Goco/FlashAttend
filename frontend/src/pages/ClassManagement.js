import React, { useState, useEffect } from "react";
import { getAllClasses, createClass, updateClassData, deleteClassData } from "../firebase/classes";
import { getAllUsers } from "../firebase/userManagement";

const BLANK_FORM = {
  subjectName: "",
  subjectCode: "",
  classCode: "",
  teacherId: "",
  days: [],
  startTime: "",
  endTime: "",
  room: "",
  status: "Active"
};

const formatTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ClassModal = ({ mode, classItem, faculties, onClose, onSave }) => {
  const [form, setForm] = useState(() => {
    const init = classItem || BLANK_FORM;
    return { ...init, days: init.days || [] };
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleDay = (day) => {
    setForm(f => {
      const currentDays = f.days || [];
      if (currentDays.includes(day)) {
        return { ...f, days: currentDays.filter(d => d !== day) };
      } else {
        return { ...f, days: [...currentDays, day] };
      }
    });
  };

  const handleSave = () => {
    if (!form.subjectName?.trim() || !form.subjectCode?.trim() || !form.classCode?.trim()) {
      alert("Subject Name, Code, and Class Code are required.");
      return;
    }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">{mode === "add" ? "▸ New Class" : "▸ Edit Class"}</div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Subject Code *</label>
            <input className="form-input" value={form.subjectCode || ""} onChange={set("subjectCode")} placeholder="e.g. CS101" />
          </div>
          <div className="form-group">
            <label className="form-label">Subject Name *</label>
            <input className="form-input" value={form.subjectName || ""} onChange={set("subjectName")} placeholder="Intro to Computer Science" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Class Code *</label>
            <input className="form-input" value={form.classCode || ""} onChange={set("classCode")} placeholder="e.g. MATH101-SEC1" />
          </div>
          <div className="form-group">
            <label className="form-label">Assign Teacher</label>
            <select className="form-select" value={form.teacherId || ""} onChange={set("teacherId")}>
              <option value="">Unassigned</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Days</label>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '6px' }}>
              {DAYS_OF_WEEK.map(d => (
                <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#c8d0e7', cursor: 'pointer' }}>
                  <input type="checkbox" checked={(form.days || []).includes(d)} onChange={() => toggleDay(d)} />
                  {d.substring(0, 3)}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start Time</label>
            <input type="time" className="form-input" value={form.startTime || ""} onChange={set("startTime")} />
          </div>
          <div className="form-group">
            <label className="form-label">End Time</label>
            <input type="time" className="form-input" value={form.endTime || ""} onChange={set("endTime")} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Room</label>
            <input className="form-input" value={form.room || ""} onChange={set("room")} placeholder="e.g. Room 301" />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status || "Active"} onChange={set("status")}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>
            {mode === "add" ? "Create Class" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ classItem, onClose, onConfirm }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal-box delete-modal">
      <div className="modal-title">▸ Remove Class</div>
      <p className="delete-msg">
        You are about to permanently remove{" "}
        <span className="delete-name">{classItem.subjectCode} - {classItem.subjectName}</span>.
        This action cannot be undone.
      </p>
      <div className="modal-actions" style={{ marginTop: 20 }}>
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-delete-confirm" onClick={onConfirm}>Remove Class</button>
      </div>
    </div>
  </div>
);

export default function ClassManagement({ pushToast }) {
  const [classes, setClasses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // { type: "add"|"edit"|"delete", classItem? }
  const PER_PAGE = 5;

  const loadData = async () => {
    try {
      // Load classes
      const classesData = await getAllClasses();
      const classesArray = Object.keys(classesData).map(key => ({
        id: key,
        ...classesData[key]
      }));
      setClasses(classesArray);

      // Load faculty
      const usersData = await getAllUsers() || {};
      const facultyArray = Object.keys(usersData)
        .map(key => {
          const u = usersData[key];
          return {
            id: key,
            ...u,
            name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || u.email || "Unknown"
          };
        })
        .filter(u => {
          const r = u.role || "";
          return typeof r === 'string' && r.trim().toLowerCase() === "faculty";
        });
      setFaculties(facultyArray);

    } catch (e) {
      console.error(e);
      pushToast("Failed to load data", "#fc8181");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = classes.filter((c) => {
    const q = search.toLowerCase();
    const matchQ = (c.subjectName || "").toLowerCase().includes(q) || (c.subjectCode || "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchQ && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const total = classes.length;
  const active = classes.filter((c) => c.status === "Active").length;
  const unassigned = classes.filter((c) => !c.teacherId).length;

  const handleAdd = async (form) => {
    try {
      const newId = await createClass(form);
      const newClass = { id: newId, ...form };
      setClasses((c) => [newClass, ...c]);
      setModal(null);
      pushToast(`Class "${form.subjectCode}" created`, "#48bb78");
    } catch (e) {
      console.error(e);
      pushToast("Failed to add class", "#fc8181");
    }
  };

  const handleEdit = async (form) => {
    try {
      await updateClassData(modal.classItem.id, form);
      const updatedClass = { ...modal.classItem, ...form };
      setClasses((c) => c.map((x) => (x.id === modal.classItem.id ? updatedClass : x)));
      setModal(null);
      pushToast(`Class "${form.subjectCode}" updated`, "#6c8ef5");
    } catch (e) {
      console.error(e);
      pushToast("Failed to update class", "#fc8181");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClassData(modal.classItem.id);
      setClasses((c) => c.filter((x) => x.id !== modal.classItem.id));
      pushToast(`Class removed`, "#fc8181");
      setModal(null);
    } catch (e) {
      pushToast("Failed to remove class", "#fc8181");
    }
  };

  const getTeacherName = (tid) => {
    if (!tid) return "Unassigned";
    const f = faculties.find(x => x.id === tid);
    return f ? f.name : "Unknown Faculty";
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Class Management</div>
          <div className="topbar-sub">Subject creation, teacher assignments, and class setup</div>
        </div>
      </div>

      <div className="page-body">
        <div className="stats-row">
          {[
            { label: "Total Classes", value: total, delta: "All registered", up: true },
            { label: "Active", value: active, delta: "Currently running", up: true },
            { label: "Unassigned", value: unassigned, delta: "Needs faculty", up: unassigned === 0 },
            { label: "Faculty", value: faculties.length, delta: "Available teachers", up: true },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className={`stat-delta ${s.up ? "delta-up" : "delta-down"}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="toolbar">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              className="search-input"
              placeholder="Search by code or name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button className="btn-add" onClick={() => setModal({ type: "add" })}>
            + Add Class
          </button>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Class Code</th>
                <th>Teacher</th>
                <th>Schedule</th>
                <th>Room</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-icon">📚</div>
                      <div className="empty-text">No classes match your filters</div>
                    </div>
                  </td>
                </tr>
              ) : (
                visible.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div>
                        <div className="user-name">{c.subjectCode}</div>
                        <div className="user-email">{c.subjectName}</div>
                      </div>
                    </td>
                    <td>
                      <div className="user-name" style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>{c.classCode || "—"}</div>
                    </td>
                    <td>
                      <span className={c.teacherId ? "user-name" : "user-email"}>
                        {getTeacherName(c.teacherId)}
                      </span>
                    </td>
                    <td style={{ color: "#7a869a" }}>
                      {(c.days && c.days.length > 0) ? (
                        <>
                          {c.days.map(d => d.substring(0, 3)).join(', ')}
                          {(c.startTime || c.endTime) && ` • ${formatTime(c.startTime)} - ${formatTime(c.endTime)}`}
                        </>
                      ) : (c.schedule || "—")}
                    </td>
                    <td style={{ color: "#7a869a" }}>{c.room || "—"}</td>
                    <td>
                      <div className="status-dot">
                        <div className={`dot ${c.status === "Active" ? "dot-active" : "dot-inactive"}`} />
                        {c.status}
                      </div>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon" onClick={() => setModal({ type: "edit", classItem: c })} title="Edit">✎</button>
                        <button className="btn-icon danger" onClick={() => setModal({ type: "delete", classItem: c })} title="Delete">✕</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pagination-row">
            <span>
              Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length || 1)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
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

      {modal?.type === "add" && (
        <ClassModal mode="add" classItem={null} faculties={faculties} onClose={() => setModal(null)} onSave={handleAdd} />
      )}
      {modal?.type === "edit" && (
        <ClassModal mode="edit" classItem={modal.classItem} faculties={faculties} onClose={() => setModal(null)} onSave={handleEdit} />
      )}
      {modal?.type === "delete" && (
        <DeleteModal classItem={modal.classItem} onClose={() => setModal(null)} onConfirm={handleDelete} />
      )}
    </>
  );
}
