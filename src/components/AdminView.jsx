import { useState } from 'react';
import { ART_PALETTE } from '../data/seedData';
import { peso, formatDate } from '../utils/helpers';

export default function AdminView({ rooms, reservations, onLogout, onApprove, onReject, onUpdateRoomStatus, onSaveRoom }) { // NEW: onSaveRoom
  const [tab, setTab] = useState('overview');
  const [filter, setFilter] = useState('all');

  // NEW: edit room state and functions
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

  const total = rooms.length;
  const occupied = rooms.filter(r => r.status === 'occupied').length;
  const available = rooms.filter(r => r.status === 'available').length;
  const pending = reservations.filter(r => r.status === 'pending').length;
  const revenue = reservations.filter(r => r.status === 'confirmed').reduce((sum, r) => {
    const room = rooms.find(rm => rm.id === r.roomId);
    return sum + (room ? room.price : 0);
  }, 0);

  const recent = reservations.slice().reverse().slice(0, 5);
  let filteredList = reservations.slice().reverse();
  if (filter !== 'all') filteredList = filteredList.filter(r => r.status === filter);

  function badgeClassFor(status) {
    return status === 'pending' ? 'badge-pending' : status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled';
  }

  return (
    <div id="view-admin" className="app-shell">
      <div className="topbar">
        <div className="topbar-left">
          <div className="brand-mini">
            <img src="/logo.png" alt="EasePlace logo" className="brand-mini-logo"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'inline-block'; }} />
            <span className="brand-dot" style={{ display: 'none' }}></span>EasePlace Admin
          </div>
          <div className="tabs">
            <button className={`tab-btn${tab === 'overview' ? ' active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
            <button className={`tab-btn${tab === 'reservations' ? ' active' : ''}`} onClick={() => setTab('reservations')}>Reservations</button>
            <button className={`tab-btn${tab === 'rooms' ? ' active' : ''}`} onClick={() => setTab('rooms')}>Rooms</button>
          </div>
        </div>
        <div className="topbar-right">
          <div className="user-chip">
            <div className="avatar">A</div>
            <div className="user-meta"><strong>Admin</strong>Property manager</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>Log out</button>
        </div>
      </div>

      <main>
        <div className="hero-strip">
          <div>
            <h1>Monitoring Dashboard</h1>
            <p>Keep an eye on vacant and occupied rooms as well as new reservation requests.</p>
          </div>
        </div>

        {tab === 'overview' && (
          <section>
            <div className="section-head"><h2>Overview</h2></div>
            <div className="row row-cols-2 row-cols-md-3 row-cols-xl-5 g-3 stat-grid">
              <div className="col"><div className="stat-card"><div className="stat-label">Total rooms</div><div className="stat-value">{total}</div></div></div>
              <div className="col"><div className="stat-card teal"><div className="stat-label">Occupied</div><div className="stat-value">{occupied}</div></div></div>
              <div className="col"><div className="stat-card"><div className="stat-label">Available now</div><div className="stat-value">{available}</div></div></div>
              <div className="col"><div className="stat-card gold"><div className="stat-label">Pending requests</div><div className="stat-value">{pending}</div></div></div>
              <div className="col"><div className="stat-card coral"><div className="stat-label">Monthly revenue</div><div className="stat-value">{peso(revenue)}</div></div></div>
            </div>
            <div className="section-head"><h2>Recent reservation requests</h2></div>
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

        {tab === 'rooms' && (
          <section>
            <div className="section-head"><h2>Room management</h2></div>
            <div className="admin-room-list">
              {rooms.map(room => {
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
                    {/* NEW: Edit button beside the status dropdown */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(room)}>Edit</button>
                      <select className="admin-room-select" value={room.status} onChange={(e) => onUpdateRoomStatus(room.id, e.target.value)}>
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Under maintenance</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <footer>
        <div className="footer-inner row g-4">
          <div className="col-12 col-md-5">
            <div className="footer-brand">Easeplace Boarding House</div>
            <p>Admin console for monitoring boarding house reservations, rooms, and daily occupancy.</p>
          </div>
          <div className="footer-col col-6 col-md-4">
            <h4>Contact us</h4>
            <p>📍 Odiong, Roxas Oriental Mindoro, Philippines</p>
            <p>📞 <a href="tel:+639123456789">+63 912 345 6789</a></p>
            <p>✉ <a href="mailto:zeirapiana@gmail.com">zeirapiana@gmail.com</a></p>
          </div>
        </div>
        <div className="footer-bottom">© 2026 EasePlace Boarding House. All rights reserved.</div>
      </footer>

      {/* NEW: Edit room modal */}
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