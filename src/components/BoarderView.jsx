import { useState } from 'react';
import RoomArt from './RoomArt';
import { peso, formatDate, initials } from '../utils/helpers';

export default function BoarderView({ currentUser, rooms, reservations, onLogout, onOpenReserve, onCancelReservation, onEditReservation }) {
  const [tab, setTab] = useState('rooms');

  const availableCount = rooms.filter(r => r.status === 'available').length;
  const myReservations = reservations.filter(r => r.username === currentUser.username);
  const myPending = myReservations.filter(r => r.status === 'pending').length;

  return (
    <div id="view-user" className="app-shell">
      <div className="topbar">
        <div className="topbar-left">
          <div className="brand-mini">
            <img src="/logo.png" alt="EasePlace logo" className="brand-mini-logo"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'inline-block'; }} />
            <span className="brand-dot" style={{ display: 'none' }}></span>EasePlace
          </div>
          <div className="tabs">
            <button className={`tab-btn${tab === 'rooms' ? ' active' : ''}`} onClick={() => setTab('rooms')}>Available rooms</button>
            <button className={`tab-btn${tab === 'reservations' ? ' active' : ''}`} onClick={() => setTab('reservations')}>My reservations</button>
          </div>
        </div>
        <div className="topbar-right">
          <div className="user-chip">
            <div className="avatar">{initials(currentUser.name)}</div>
            <div className="user-meta"><strong>{currentUser.name}</strong>Boarder</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>Log out</button>
        </div>
      </div>

      <main>
        <div className="hero-strip">
          <div>
            <h1>You are Welcome , {currentUser.name.split(' ')[0]}!</h1>
            <p>Check the available rooms and the status of your reservations.</p>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><b>{availableCount}</b><span>Available rooms</span></div>
            <div className="hero-stat"><b>{myPending}</b><span>Pending requests</span></div>
          </div>
        </div>

        {tab === 'rooms' && (
          <section>
            <div className="section-head"><h2>Available rooms</h2></div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 room-grid">
              {rooms.map(room => {
                const badgeClass = room.status === 'available' ? 'badge-available' : room.status === 'occupied' ? 'badge-occupied' : 'badge-maintenance';
                const badgeLabel = room.status === 'available' ? 'Available' : room.status === 'occupied' ? 'Occupied' : 'Maintenance';
                const shown = room.amenities.slice(0, 3);
                const extra = room.amenities.length - shown.length;
                return (
                  <div className="col" key={room.id}>
                    <div className="room-card">
                      <div className="room-art">
                        <img src={`/${room.image}`} alt={room.name}
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block'; }} />
                        <div className="room-art-fallback" style={{ display: 'none' }}>
                          <RoomArt paletteKey={room.art} />
                        </div>
                      </div>
                      <div className="room-body">
                        <div className="room-top">
                          <div>
                            <div className="room-name">{room.name}</div>
                            <div className="room-type">{room.type}</div>
                          </div>
                          <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
                        </div>
                        <div className="room-price">{peso(room.price)}<span> / month</span></div>
                        <div className="room-cap">Sleeps {room.capacity} {room.capacity > 1 ? 'boarders' : 'boarder'}</div>
                        <div className="amenity-row">
                          {shown.map(a => <span className="amenity-chip" key={a}>{a}</span>)}
                          {extra > 0 && <span className="amenity-chip">+{extra} more</span>}
                        </div>
                        <div className="room-actions">
                          <button
                            className={`btn ${room.status === 'available' ? 'btn-primary' : 'btn-ghost'}`}
                            disabled={room.status !== 'available'}
                            onClick={() => onOpenReserve(room.id)}
                          >
                            {room.status === 'available' ? 'Reserve room' : 'Not available'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {tab === 'reservations' && (
          <section>
            <div className="section-head"><h2>My reservations</h2></div>
            <div className="res-list">
              {myReservations.length === 0 ? (
                <div className="empty-state">
                  <h3>No reservations for now</h3>
                  <p>Choose a room to make a reservation.</p>
                </div>
              ) : (
                myReservations.slice().reverse().map(res => {
                  const room = rooms.find(r => r.id === res.roomId);
                  const badgeClass = res.status === 'pending' ? 'badge-pending' : res.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled';
                  return (
                    <div className="res-card" key={res.id}>
                      <div className="res-info">
                        <h3>{room ? room.name : 'Room'}</h3>
                        <div className="res-meta">
                          <span>Move-in: {formatDate(res.moveIn)}</span>
                          <span>{res.months} month{res.months > 1 ? 's' : ''}</span>
                          <span>Submitted {formatDate(res.createdAt)}</span>
                        </div>
                      </div>
                      <div className="res-side">
                        <span className={`badge ${badgeClass}`}>{res.status.charAt(0).toUpperCase() + res.status.slice(1)}</span>
                        {res.status === 'pending' && (
                          <button className="btn btn-danger btn-sm" onClick={() => onCancelReservation(res.id)}>Cancel</button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}
      </main>

      <footer>
        <div className="footer-inner row g-4">
          <div className="col-12 col-md-5">
            <div className="footer-brand">Easeplace</div>
            <p>Providing comfort, cleanliness and safety for every guest. Our spaces are designed to feel warm, and make everyone feel like home.</p>
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
    </div>
  );
}
