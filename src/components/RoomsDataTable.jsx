import { useState, useEffect } from 'react';
import ReserveModal from './ReserveModal';

export default function RoomsTable({ currentUserName }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null
    
  );

  useEffect(() => {
    fetch('http://localhost:8080/api/reservations')
      .then((response) => response.json())
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function handleReserveSubmit(reservation) {
    if (!reservation) {
      alert('Please fill out all required fields.');
      return;
    }
    console.log('Reservation submitted:', reservation);
    setSelectedRoom(null); // close modal
  }

  return (
    <div className="table-wrap">
      <h2 style={{ padding: '18px 18px 0' }}>Rooms</h2>

      {loading && <p style={{ padding: 18 }}>Loading rooms...</p>}
      {error && <p style={{ padding: 18, color: 'var(--coral-dark)' }}>Error: {error}</p>}

      {!loading && !error && (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Room Numbeer</th>
              <th>Room Type</th>
              <th>Price</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.RoomNumber}</td>
                <td>{room.RoomType}</td>
                <td>₱{room.price.toLocaleString()}</td>
                <td>{room.capacity}</td>
                <td>
                  <span className={`badge badge-${room.status}`}>{room.status}</span>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    disabled={room.status !== 'available'}
                    onClick={() => setSelectedRoom(room)}
                  >
                    Reserve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedRoom && (
        <ReserveModal
          room={selectedRoom}
          currentUserName={currentUserName}
          onClose={() => setSelectedRoom(null)}
          onSubmit={handleReserveSubmit}
        />
      )}
    </div>
  );
}