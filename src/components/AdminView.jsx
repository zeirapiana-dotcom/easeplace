import { useState } from 'react';
import { ART_PALETTE } from '../data/seedData';
import { peso, formatDate } from '../utils/helpers';

const NAV_ICONS = {
  overview: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="19" height="19">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  reservations: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="19" height="19">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="9 16 11 18 15 14" />
    </svg>
  ),
  rooms: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="19" height="19">
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  ),
};

const PAGE_INFO = {
  overview: { title: 'Overview', sub: 'A quick summary of your rooms, reservations and revenue.' },
  reservations: { title: 'Reservations', sub: 'Review, approve or reject reservation requests.' },
  rooms: { title: 'Rooms', sub: 'Manage room details, availability and listings.' },
};

export default function AdminView({ rooms, reservations, onLogout, onApprove, onReject, onUpdateRoomStatus, onSaveRoom, onDeleteRoom, onRestoreRoom }) {
  const [tab, setTab] = useState('overview');
  const [filter, setFilter] = useState('all');
  const [roomView, setRoomView] = useState('active'); // 'active' | 'deleted'
  const [sidebarOpen, setSidebarOpen] = useState(false); // para sa mobile

  // Edit room state and functions
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState({ name: '', type: '', price: '', capacity: '', amenities: '' });

  function openEdit(room) {
    setEditingRoom(room);
    setForm({
      name: room.name,
      type: room.type,
      price: room.price,
      capacity: room.capacity,
      amenities: room.amenities.join(', '),
    });
  }

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function saveEdit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.type.trim() || Number(form.price) < 0 || Number(form.capacity) < 1) return;

    onSaveRoom(editingRoom.id, {
      name: form.name.trim(),
      type: form.type.trim(),
      price: Number(form.price),
      capacity: Number(form.capacity),
      amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean),
    });
    setEditingRoom(null);
  }

  // Delete room (soft delete, with confirmation)
  function confirmDelete(room) {
    if (window.confirm(`Move ${room.name} to Deleted? You can restore it later.`)) {
      onDeleteRoom(room.id);
    }
  }

  function goTo(key) {
    setTab(key);
    setSidebarOpen(false);
  }

  // separate active and deleted rooms
  const activeRooms = rooms.filter(r => !r.deleted);
  const deletedRooms = rooms.filter(r => r.deleted);

  const total = activeRooms.length;
  const occupied = activeRooms.filter(r => r.status === 'occupied').length;
  const available = activeRooms.filter(r => r.status === 'available').length;
  const maintenance = activeRooms.filter(r => r.status === 'maintenance').length;
  const pending = reservations.filter(r => r.status === 'pending').length;
  const confirmed = reservations.filter(r => r.status === 'confirmed').length;
  const cancelled = reservations.filter(r => r.status === 'cancelled').length;
  const revenue = reservations.filter(r => r.status === 'confirmed').reduce((sum, r) => {
    const room = rooms.find(rm => rm.id === r.roomId);
    return sum + (room ? room.price : 0);
  }, 0);
  const occupancyRate = total ? Math.round((occupied / total) * 100) : 0;

  const recent = reservations.slice().reverse().slice(0, 5);
  let filteredList = reservations.slice().reverse();
  if (filter !== 'all') filteredList = filteredList.filter(r => r.status === filter);

  function badgeClassFor(status) {
    return status === 'pending' ? 'badge-pending' : status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled';
  }

  // ---------- Chart data ----------

  // 1) Move-ins by month (huling 6 na buwan)
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push({
      key,
      label: d.toLocaleString('en-US', { month: 'short' }),
      count: reservations.filter(r => typeof r.moveIn === 'string' && r.moveIn.slice(0, 7) === key).length,
    });
  }
  const maxMonth = Math.max(1, ...months.map(m => m.count));

  // 2) Reservation status donut
  const R = 54;
  const C = 2 * Math.PI * R;
  const resTotal = confirmed + pending + cancelled;
  const segments = [
    { label: 'Confirmed', value: confirmed, color: '#26433A' },
    { label: 'Pending', value: pending, color: '#C9932E' },
    { label: 'Cancelled', value: cancelled, color: '#B5533C' },
  ];
  let acc = 0;
  const arcs = segments.map(s => {
    const len = resTotal ? (s.value / resTotal) * C : 0;
    const arc = { ...s, len, offset: -acc };
    acc += len;
    return arc;
  });

  // 3) Room status bars
  const roomStats = [
    { label: 'Available', value: available, color: '#26433A' },
    { label: 'Occupied', value: occupied, color: '#3E6E77' },
    { label: 'Maintenance', value: maintenance, color: '#C9932E' },
  ];

  const todayLabel = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div id="view-admin" className="admin-layout">
      {/* Overlay para sa mobile */}
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ===== SIDEBAR ===== */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-brand">
          <span className="admin-brand-logo">
            <img src="/images/logo.png" alt="EasePlace logo" onError={(e) => { e.target.style.display = 'none'; }} />
          </span>
          <div>
            <div className="admin-brand-name">EasePlace</div>
            <div className="admin-brand-role">Admin Panel</div>
          </div>
        </div>

        <div className="admin-nav-label">Menu</div>
        <nav className="admin-nav">
          {['overview', 'reservations', 'rooms'].map(key => (
            <button
              key={key}
              type="button"
              className={`admin-nav-btn${tab === key ? ' active' : ''}`}
              onClick={() => goTo(key)}
            >
              {NAV_ICONS[key]}
              <span>{PAGE_INFO[key].title}</span>
              {key === 'reservations' && pending > 0 && <em className="admin-nav-count">{pending}</em>}
            </button>
          ))}
        </nav>

        <div className="admin-side-foot">
          <div className="admin-side-user">
            <div className="avatar">A</div>
            <div className="user-meta"><strong>Admin</strong>Property manager</div>
          </div>
          <button type="button" className="admin-logout" onClick={onLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="admin-body">
        {/* mobile top bar */}
        <div className="admin-mobile-bar">
          <button type="button" className="admin-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="admin-mobile-title">EasePlace Admin</span>
        </div>

        <main className="admin-content">
          <div className="admin-page-head">
            <div>
              <h1>{PAGE_INFO[tab].title}</h1>
              <p>{PAGE_INFO[tab].sub}</p>
            </div>
            <div className="admin-date">{todayLabel}</div>
          </div>

          {/* ---------- OVERVIEW ---------- */}
          {tab === 'overview' && (
            <section>
              <div className="row row-cols-2 row-cols-md-3 row-cols-xl-5 g-3 stat-grid">
                <div className="col"><div className="stat-card"><div className="stat-label">Total rooms</div><div className="stat-value">{total}</div></div></div>
                <div className="col"><div className="stat-card teal"><div className="stat-label">Occupied</div><div className="stat-value">{occupied}</div></div></div>
                <div className="col"><div className="stat-card"><div className="stat-label">Available now</div><div className="stat-value">{available}</div></div></div>
                <div className="col"><div className="stat-card gold"><div className="stat-label">Pending requests</div><div className="stat-value">{pending}</div></div></div>
                <div className="col"><div className="stat-card coral"><div className="stat-label">Monthly revenue</div><div className="stat-value">{peso(revenue)}</div></div></div>
              </div>

              {/* GRAPHS */}
              <div className="admin-chart-grid">
                {/* Bar chart */}
                <div className="admin-card">
                  <h3>Move-ins by month</h3>
                  <p className="admin-card-sub">Number of reservations per move-in month (last 6 months)</p>
                  <div className="bar-chart">
                    {months.map(m => (
                      <div className="bar-col" key={m.key}>
                        <span className="bar-value">{m.count}</span>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ height: m.count ? `${(m.count / maxMonth) * 100}%` : '4px', opacity: m.count ? 1 : 0.25 }} />
                        </div>
                        <span className="bar-label">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Donut chart */}
                <div className="admin-card">
                  <h3>Reservation status</h3>
                  <p className="admin-card-sub">Breakdown of all reservations</p>
                  <div className="donut-wrap">
                    <svg viewBox="0 0 140 140" width="140" height="140" role="img" aria-label="Reservation status chart">
                      <circle cx="70" cy="70" r={R} fill="none" stroke="#E7E4D4" strokeWidth="18" />
                      {arcs.map(a => a.len > 0 && (
                        <circle
                          key={a.label}
                          cx="70" cy="70" r={R} fill="none"
                          stroke={a.color} strokeWidth="18"
                          strokeDasharray={`${a.len} ${C - a.len}`}
                          strokeDashoffset={a.offset}
                          transform="rotate(-90 70 70)"
                        />
                      ))}
                      <text x="70" y="68" textAnchor="middle" className="donut-total">{resTotal}</text>
                      <text x="70" y="86" textAnchor="middle" className="donut-caption">total</text>
                    </svg>
                    <ul className="donut-legend">
                      {segments.map(s => (
                        <li key={s.label}>
                          <i style={{ background: s.color }} />
                          <span>{s.label}</span>
                          <b>{s.value}</b>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Room status bars */}
                <div className="admin-card">
                  <h3>Room status</h3>
                  <p className="admin-card-sub">Occupancy rate: <strong>{occupancyRate}%</strong></p>
                  <div className="hbar-list">
                    {roomStats.map(s => (
                      <div className="hbar-row" key={s.label}>
                        <div className="hbar-top"><span>{s.label}</span><b>{s.value} / {total}</b></div>
                        <div className="hbar-track">
                          <div className="hbar-fill" style={{ width: `${total ? (s.value / total) * 100 : 0}%`, background: s.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RECENT REQUESTS */}
              <div className="section-head">
                <h2>Recent reservation requests</h2>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => goTo('reservations')}>View all</button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Guest</th><th>Room</th><th>Move-in</th><th>Status</th></tr></thead>
                  <tbody>
                    {recent.map(res => {
                      const room = rooms.find(r => r.id === res.roomId);
                      return (
                        <tr key={res.id}>
                          <td>{res.guestName}</td>
                          <td>{room ? room.name : '—'}</td>
                          <td>{formatDate(res.moveIn)}</td>
                          <td><span className={`badge ${badgeClassFor(res.status)}`}>{res.status.charAt(0).toUpperCase() + res.status.slice(1)}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ---------- RESERVATIONS ---------- */}
          {tab === 'reservations' && (
            <section>
              <div className="section-head">
                <h2>All reservations</h2>
                <div className="chip-filters">
                  {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
                    <button key={f} className={`chip-filter${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Guest</th><th>Room</th><th>Move-in</th><th>Duration</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredList.length === 0 ? (
                      <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--ink-soft)', padding: 28 }}>No reservations found for this filter.</td></tr>
                    ) : (
                      filteredList.map(res => {
                        const room = rooms.find(r => r.id === res.roomId);
                        return (
                          <tr key={res.id}>
                            <td>{res.guestName}</td>
                            <td>{room ? room.name : '—'}</td>
                            <td>{formatDate(res.moveIn)}</td>
                            <td>{res.months} mo.</td>
                            <td><span className={`badge ${badgeClassFor(res.status)}`}>{res.status.charAt(0).toUpperCase() + res.status.slice(1)}</span></td>
                            <td>
                              <div className="row-actions">
                                {res.status === 'pending' && (
                                  <>
                                    <button className="btn btn-primary btn-sm" onClick={() => onApprove(res.id)}>Approve</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => onReject(res.id)}>Reject</button>
                                  </>
                                )}
                                {res.status === 'confirmed' && (
                                  <button className="btn btn-danger btn-sm" onClick={() => onReject(res.id)}>Cancel</button>
                                )}
                                {res.status === 'cancelled' && (
                                  <span style={{ color: 'var(--ink-soft)', fontSize: 13 }}>No actions</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ---------- ROOMS ---------- */}
          {tab === 'rooms' && (
            <section>
              <div className="section-head">
                <h2>Room management</h2>
                {/* Active / Deleted filter */}
                <div className="chip-filters">
                  <button className={`chip-filter${roomView === 'active' ? ' active' : ''}`} onClick={() => setRoomView('active')}>
                    Active ({activeRooms.length})
                  </button>
                  <button className={`chip-filter${roomView === 'deleted' ? ' active' : ''}`} onClick={() => setRoomView('deleted')}>
                    Deleted ({deletedRooms.length})
                  </button>
                </div>
              </div>

              <div className="admin-room-list">
                {roomView === 'active' && activeRooms.map(room => {
                  const p = ART_PALETTE[room.art] || ART_PALETTE.forest;
                  return (
                    <div className="admin-room-row" key={room.id}>
                      <div className="admin-room-info">
                        <div className="admin-room-swatch" style={{ background: p.wall, border: `2px solid ${p.roof}` }}></div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{room.name}</div>
                          <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{room.type} · {peso(room.price)}/mo · Sleeps {room.capacity}</div>
                        </div>
                      </div>
                      {/* Edit + Delete buttons beside the status dropdown */}
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(room)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(room)}>Delete</button>
                        <select className="admin-room-select" value={room.status} onChange={(e) => onUpdateRoomStatus(room.id, e.target.value)}>
                          <option value="available">Available</option>
                          <option value="occupied">Occupied</option>
                          <option value="maintenance">Under maintenance</option>
                        </select>
                      </div>
                    </div>
                  );
                })}

                {/* Deleted rooms with Restore button */}
                {roomView === 'deleted' && deletedRooms.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--ink-soft)', padding: 28 }}>No deleted rooms.</p>
                )}
                {roomView === 'deleted' && deletedRooms.map(room => {
                  const p = ART_PALETTE[room.art] || ART_PALETTE.forest;
                  return (
                    <div className="admin-room-row" key={room.id} style={{ opacity: 0.75 }}>
                      <div className="admin-room-info">
                        <div className="admin-room-swatch" style={{ background: p.wall, border: `2px solid ${p.roof}` }}></div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{room.name}</div>
                          <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{room.type} · {peso(room.price)}/mo · Sleeps {room.capacity}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button className="btn btn-primary btn-sm" onClick={() => onRestoreRoom(room.id)}>Restore</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Edit room modal */}
      {editingRoom && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-head">
              <h2>Edit {editingRoom.name}</h2>
              <button className="modal-close" onClick={() => setEditingRoom(null)} aria-label="Close">✕</button>
            </div>
            <form onSubmit={saveEdit}>
              <div className="field">
                <label htmlFor="room-name">Room name</label>
                <input type="text" id="room-name" name="name" value={form.name} onChange={handleFormChange} required />
              </div>
              <div className="field">
                <label htmlFor="room-type">Type</label>
                <input type="text" id="room-type" name="type" value={form.type} onChange={handleFormChange} required />
              </div>
              <div className="field">
                <label htmlFor="room-price">Price per month (₱)</label>
                <input type="number" id="room-price" name="price" min="0" value={form.price} onChange={handleFormChange} required />
              </div>
              <div className="field">
                <label htmlFor="room-capacity">Capacity (sleeps)</label>
                <input type="number" id="room-capacity" name="capacity" min="1" value={form.capacity} onChange={handleFormChange} required />
              </div>
              <div className="field">
                <label htmlFor="room-amenities">Amenities (separate with commas)</label>
                <input type="text" id="room-amenities" name="amenities" value={form.amenities} onChange={handleFormChange} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}