import { useState } from 'react';
import { peso } from '../utils/helpers';

export default function ReserveModal({ room, currentUserName, onClose, onSubmit }) {
  const today = new Date().toISOString().split('T')[0];
  const [name, setName] = useState(currentUserName);
  const [contact, setContact] = useState('');
  const [moveIn, setMoveIn] = useState('');
  const [months, setMonths] = useState(6);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const api_url = 'http://localhost:8080/api/reservations';

  async function formSubmit(e) {
    e.preventDefault();

    // if (!name.trim() || !contact.trim() || !moveIn || !months || months < 1) {
    //   onSubmit(null); // signal invalid -> parent shows toast
    //   return;
    // }



    try {
      const response = await fetch(api_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          contact: contact,

        })
      });
// pass back the saved reservation to the parent
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-head">
          <h2>Reserve {room.name}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <p className="modal-sub">{room.type} · {peso(room.price)} per month. We will confirm within 24 hours.</p>

        {error && <p style={{ color: 'var(--coral-dark)' }}>Error: {error}</p>}

        <form onSubmit={formSubmit}>
          <div className="field">
            <label htmlFor="res-name">Full name</label>
            <input type="text" id="res-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="res-contact">Contact number</label>
            <input type="tel" id="res-contact" placeholder="09XX XXX XXXX" value={contact} onChange={(e) => setContact(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="res-movein">Preferred move-in date</label>
            <input type="date" id="res-movein" min={today} value={moveIn} onChange={(e) => setMoveIn(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="res-months">Duration (months)</label>
            <input type="number" id="res-months" min="1" max="24" value={months} onChange={(e) => setMonths(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="res-notes">Notes (optional)</label>
            <textarea id="res-notes" rows="3" placeholder="Special requests, arrival time, etc." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit reservation'}
          </button>
        </form>
      </div>
    </div>
  );
}