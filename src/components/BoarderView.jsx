import { useState } from 'react';
import RoomArt from './RoomArt';
import { peso, formatDate, initials } from '../utils/helpers';

const STEP_LABELS = ['Submitted', 'Under review', 'Confirmed'];

function stepState(status, i) {
  if (status === 'confirmed') return 'done';
  if (status === 'pending') return i === 0 ? 'done' : i === 1 ? 'current' : 'todo';
  return 'todo';
}

export default function BoarderView({ currentUser, rooms, reservations, onLogout, onOpenReserve, onCancelReservation, onEditReservation }) {
  const [tab, setTab] = useState('rooms');

  // rooms: search
  const [search, setSearch] = useState('');

  // reservations filter
  const [resFilter, setResFilter] = useState('all');

  const firstName = currentUser.name.split(' ')[0];

  const myReservations = reservations.filter(r => r.username === currentUser.username);
  const myPending = myReservations.filter(r => r.status === 'pending').length;

  // rooms after search
  const shownRooms = rooms.filter(r =>
    `${r.name} ${r.type}`.toLowerCase().includes(search.trim().toLowerCase())
  );

  // reservations after filter
  let shownReservations = myReservations.slice().reverse();
  if (resFilter !== 'all') shownReservations = shownReservations.filter(r => r.status === resFilter);

  const heroTitle = tab === 'rooms' ? `Welcome back, ${firstName}!` : 'Your reservations';
  const heroSub = tab === 'rooms'
    ? 'Find a comfortable room and reserve your stay in just a few clicks.'
    : 'Track the status of every reservation request you have made.';

  return (
    <div id="view-user" className="bd-shell">
      {/* ===== NAVBAR ===== */}
      <header className="bd-nav">
        <div className="bd-nav-inner">
          <div className="bd-brand">
            <span className="bd-brand-logo">
              <img src="/images/logo.png" alt="EasePlace logo" onError={(e) => { e.target.style.display = 'none'; }} />
            </span>
            EasePlace
          </div>

          <nav className="bd-links">
            <button type="button" className={`bd-link${tab === 'rooms' ? ' active' : ''}`} onClick={() => setTab('rooms')}>
              Available rooms
            </button>
            <button type="button" className={`bd-link${tab === 'reservations' ? ' active' : ''}`} onClick={() => setTab('reservations')}>
              My reservations
              {myPending > 0 && <em className="bd-link-count">{myPending}</em>}
            </button>
          </nav>

          <div className="bd-user">
            <div className="user-chip">
              <div className="avatar">{initials(currentUser.name)}</div>
              <div className="user-meta"><strong>{currentUser.name}</strong>Boarder</div>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onLogout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="bd-main">
        {/* ===== HERO ===== */}
        <section className="bd-hero">
          <span className="bd-eyebrow">Boarder Portal</span>
          <h1>{heroTitle}</h1>
          <p>{heroSub}</p>
        </section>

        {/* ===== ROOMS TAB ===== */}
        {tab === 'rooms' && (
          <>
            <div className="bd-search">
              <div className="bd-search-field">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search room name or type..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="bd-section-head">
              <h2>Available rooms</h2>
              <span>Showing {shownRooms.length} of {rooms.length} rooms</span>
            </div>

            {shownRooms.length === 0 ? (
              <div className="empty-state">
                <h3>No rooms found</h3>
                <p>Try a different search.</p>
              </div>
            ) : (
              <div className="bd-grid">
                {shownRooms.map(room => {
                  const badgeClass = room.status === 'available' ? 'badge-available' : room.status === 'occupied' ? 'badge-occupied' : 'badge-maintenance';
                  const badgeLabel = room.status === 'available' ? 'Available' : room.status === 'occupied' ? 'Occupied' : 'Maintenance';
                  const shown = room.amenities.slice(0, 3);
                  const extra = room.amenities.length - shown.length;
                  const isAvailable = room.status === 'available';
                  return (
                    <article className={`bd-room${isAvailable ? '' : ' is-unavailable'}`} key={room.id}>
                      <div className="bd-room-img">
                        <img src={`/${room.image}`} alt={room.name}
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block'; }} />
                        <div className="room-art-fallback" style={{ display: 'none' }}>
                          <RoomArt paletteKey={room.art} />
                        </div>
                        <span className={`badge bd-room-badge ${badgeClass}`}>{badgeLabel}</span>
                        <div className="bd-room-price">{peso(room.price)}<span> / month</span></div>
                      </div>

                      <div className="bd-room-body">
                        <div>
                          <h3 className="bd-room-name">{room.name}</h3>
                          <div className="bd-room-type">{room.type}</div>
                        </div>

                        <div className="bd-room-meta">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          Sleeps {room.capacity} {room.capacity > 1 ? 'boarders' : 'boarder'}
                        </div>

                        <div className="amenity-row">
                          {shown.map(a => <span className="amenity-chip" key={a}>{a}</span>)}
                          {extra > 0 && <span className="amenity-chip">+{extra} more</span>}
                        </div>

                        <button
                          className={`btn ${isAvailable ? 'btn-primary' : 'btn-ghost'} bd-room-btn`}
                          disabled={!isAvailable}
                          onClick={() => onOpenReserve(room.id)}
                        >
                          {isAvailable ? 'Reserve room' : 'Not available'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ===== RESERVATIONS TAB ===== */}
        {tab === 'reservations' && (
          <>
            <div className="bd-section-head" style={{ marginTop: 32 }}>
              <h2>Your requests</h2>
              <div className="chip-filters">
                {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
                  <button key={f} className={`chip-filter${resFilter === f ? ' active' : ''}`} onClick={() => setResFilter(f)}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bd-res-list">
              {shownReservations.length === 0 ? (
                <div className="empty-state">
                  <h3>{myReservations.length === 0 ? 'No reservations for now' : 'No reservations found'}</h3>
                  <p>{myReservations.length === 0 ? 'Choose a room to make a reservation.' : 'Try a different filter.'}</p>
                  {myReservations.length === 0 && (
                    <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => setTab('rooms')}>Browse rooms</button>
                  )}
                </div>
              ) : (
                shownReservations.map(res => {
                  const room = rooms.find(r => r.id === res.roomId);
                  const badgeClass = res.status === 'pending' ? 'badge-pending' : res.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled';
                  return (
                    <article className="bd-res" key={res.id}>
                      <div className="bd-res-top">
                        {room && room.image && (
                          <img className="bd-res-thumb" src={`/${room.image}`} alt={room.name}
                            onError={(e) => { e.target.style.display = 'none'; }} />
                        )}
                        <div className="bd-res-info">
                          <h3>{room ? room.name : 'Room'}</h3>
                          <div className="res-meta">
                            <span>Move-in: {formatDate(res.moveIn)}</span>
                            <span>{res.months} month{res.months > 1 ? 's' : ''}</span>
                            <span>Submitted {formatDate(res.createdAt)}</span>
                          </div>
                        </div>
                        <div className="bd-res-side">
                          <span className={`badge ${badgeClass}`}>{res.status.charAt(0).toUpperCase() + res.status.slice(1)}</span>
                          {res.status === 'pending' && (
                            <button className="btn btn-danger btn-sm" onClick={() => onCancelReservation(res.id)}>Cancel</button>
                          )}
                        </div>
                      </div>

                      {res.status === 'cancelled' ? (
                        <div className="bd-cancelled-note">This reservation was cancelled.</div>
                      ) : (
                        <div className="bd-steps">
                          {STEP_LABELS.map((label, i) => {
                            const state = stepState(res.status, i);
                            return (
                              <div className="bd-step-wrap" key={label}>
                                <div className={`bd-step ${state}`}>
                                  <span className="bd-step-dot">{state === 'done' ? '✓' : i + 1}</span>
                                  <span className="bd-step-label">{label}</span>
                                </div>
                                {i < STEP_LABELS.length - 1 && (
                                  <span className={`bd-step-line${stepState(res.status, i + 1) !== 'todo' ? ' done' : ''}`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}