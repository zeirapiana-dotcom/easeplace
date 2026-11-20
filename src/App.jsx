import { useState, useRef, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import BoarderView from './components/BoarderView';
import AdminView from './components/AdminView';
import ReserveModal from './components/ReserveModal';
import Toast from './components/Toast';
import { initialReservations } from './data/seedData';
import './App.css'
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';


// rooms na ngayon ang kinukuha sa MySQL (easeplace_db)
const API_URL = 'http://localhost:8080/api/rooms';

// ---------- Mga mapper: database <-> app ----------
// art (kulay ng room) ayon sa capacity, dahil wala itong column sa database
const ART_BY_CAPACITY = { 1: 'forest', 2: 'teal', 4: 'coral' };

// database row -> room object na naiintindihan ng AdminView at BoarderView
function toAppRoom(row) {
  const num = (String(row.room_name).match(/\d+/) || [''])[0]; // "Room 101" -> "101"
  return {
    id: `r${row.room_id}`,
    name: row.room_name,
    type: row.room_type,
    price: Number(row.price),
    capacity: Number(row.capacity),
    status: String(row.status).toLowerCase(), // "Available" -> "available"
    amenities: row.amenities ? row.amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
    art: ART_BY_CAPACITY[Number(row.capacity)] || 'forest',
    image: `images/room${num}.jpg`,
    deleted: Boolean(row.deleted),
  };
}

// room object ng app -> fields ng database
function toDbRoom(room) {
  return {
    room_name: room.name,
    room_type: room.type,
    price: room.price,
    capacity: room.capacity,
    status: room.status.charAt(0).toUpperCase() + room.status.slice(1), // "available" -> "Available"
    amenities: room.amenities.join(', '),
    deleted: room.deleted ? 1 : 0,
  };
}

// "r5" -> 5
function dbId(id) {
  return Number(String(id).replace('r', ''));
}

export default function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [rooms, setRooms] = useState([]); // galing na sa database
  const [reservations, setReservations] = useState(initialReservations);
  const [activeReserveRoomId, setActiveReserveRoomId] = useState(null);
  const [toast, setToast] = useState({ message: '', show: false });
  const resIdCounter = useRef(4);
  const toastTimer = useRef(null);

  function showToast(message) {
    setToast({ message, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2600);
  }

  // kunin ang lahat ng rooms (kasama ang deleted) sa database
  async function loadRooms() {
    try {
      const res = await fetch(`${API_URL}?all=1`);
      if (!res.ok) throw new Error('Failed to load rooms');
      const data = await res.json();
      setRooms(data.map(toAppRoom));
    } catch (err) {
      console.error('Could not load rooms:', err);
    }
  }

  // i-load ang rooms pag naka-login, tapos auto-refresh bawat 3 segundo
  // (para lumabas sa dashboard ang edit/delete mo sa phpMyAdmin)
  useEffect(() => {
    if (!currentUser) return;
    loadRooms();
    const timer = setInterval(loadRooms, 3000);
    return () => clearInterval(timer);
  }, [currentUser]);

  // ipadala ang buong room sa backend (update sa MySQL)
  async function syncRoom(room) {
    const res = await fetch(`${API_URL}/${dbId(room.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toDbRoom(room)),
    });
    if (!res.ok) throw new Error('Sync failed');
    return res.json();
  }

  // 1. Authentication, User Synchronization, & Role Retrieval
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Reference to user's profile document in Firestore
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          let role = 'boarder';

          if (userSnap.exists()) {
            // Fetch existing role
            role = userSnap.data().role || 'boarder';
          } else {
            // New user: save profile to Firestore with a default role
            await setDoc(userRef, {
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              role: 'boarder',
              createdAt: serverTimestamp()
            });
          }

          setCurrentUser({
            role,
            username: firebaseUser.email,
            name: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            provider: 'google'
          });
        } catch (error) {
          console.error('Failed to load user profile:', error);
          showToast('Could not load your profile. Please try again.');
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Login Handler
  async function handleGoogleLogin() {
    await signInWithPopup(auth, googleProvider);
  }

  // Logout Handler
  async function handleLogout() {
    await signOut(auth);
    setCurrentUser(null);
    navigate('/'); // bumalik sa landing page pagka-logout
  }

  function handleOpenReserve(roomId) {
    setActiveReserveRoomId(roomId);
  }

  function handleCloseReserve() {
    setActiveReserveRoomId(null);
  }

  function handleSubmitReservation(formData) {
    if (!formData) {
      showToast('Please complete all required fields.');
      return;
    }
    const newRes = {
      id: 'res' + (resIdCounter.current++),
      roomId: activeReserveRoomId,
      ...formData,
      status: 'pending',
      username: currentUser.username,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setReservations(prev => [...prev, newRes]);
    setActiveReserveRoomId(null);
    showToast('Reservation submitted! Wait for admin confirmation.');
  }

  function handleCancelReservation(id) {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
    showToast('Reservation cancelled.');
  }

  function handleApprove(id) {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'confirmed' } : r));
    const res = reservations.find(r => r.id === id);
    if (res) {
      const room = rooms.find(r => r.id === res.roomId);
      setRooms(prev => prev.map(r => r.id === res.roomId ? { ...r, status: 'occupied' } : r));
      if (room) syncRoom({ ...room, status: 'occupied' }).catch(console.error);
    }
    showToast('Reservation confirmed.');
  }

  function handleReject(id) {
    const res = reservations.find(r => r.id === id);
    const wasConfirmed = res && res.status === 'confirmed';
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
    if (wasConfirmed && res) {
      const room = rooms.find(r => r.id === res.roomId);
      setRooms(prev => prev.map(r => r.id === res.roomId ? { ...r, status: 'available' } : r));
      if (room) syncRoom({ ...room, status: 'available' }).catch(console.error);
    }
    showToast(wasConfirmed ? 'Reservation cancelled.' : 'Reservation rejected.');
  }

  async function handleUpdateRoomStatus(roomId, status) {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    try {
      await syncRoom({ ...room, status });
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status } : r));
      showToast(room.name + ' updated to ' + status + '.');
    } catch (err) {
      console.error(err);
      showToast('Could not update the room status. Please try again.');
    }
  }

  async function handleSaveRoom(roomId, updates) {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const updatedRoom = { ...room, ...updates };

    try {
      const saved = await syncRoom(updatedRoom);
      console.log('Updated:', saved);

      setRooms(prev => prev.map(r => r.id === roomId ? updatedRoom : r));
      showToast(updatedRoom.name + ' updated.');
    } catch (err) {
      console.error(err);
      showToast('Could not save the room. Please try again.');
    }
  }

  // soft delete: nagiging deleted = 1 sa database, kaya pwede pang i-restore
  async function handleDeleteRoom(roomId) {
    const room = rooms.find(r => r.id === roomId);

    // do not delete a room that still has pending/confirmed reservations
    const hasActiveReservation = reservations.some(
      r => r.roomId === roomId && (r.status === 'pending' || r.status === 'confirmed')
    );
    if (hasActiveReservation) {
      showToast('Cannot delete a room with pending or confirmed reservations.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${dbId(roomId)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');

      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, deleted: true } : r));
      showToast((room ? room.name : 'Room') + ' moved to Deleted.');
    } catch (err) {
      console.error(err);
      showToast('Could not delete the room. Please try again.');
    }
  }

  // ibalik ang room (deleted = 0 sa database)
  async function handleRestoreRoom(roomId) {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    try {
      await syncRoom({ ...room, deleted: false });
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, deleted: false } : r));
      showToast(room.name + ' restored.');
    } catch (err) {
      console.error(err);
      showToast('Could not restore the room. Please try again.');
    }
  }

  const activeRoom = rooms.find(r => r.id === activeReserveRoomId);

  if (authLoading) return <h2>Loading Application State...</h2>;

  return (
    <>
      <Routes>
        <Route path="/" element={
          currentUser ? <Navigate to="/dashboard" replace />
            : <LandingPage onLoginClick={() => navigate('/login')} />
        } />

        <Route path="/login" element={
          currentUser ? <Navigate to="/dashboard" replace />
            : <Login onGoogleLogin={handleGoogleLogin} onBack={() => navigate('/')} />
        } />

        {/* /dashboard: ipapadala ka sa tamang page ayon sa role */}
        <Route path="/dashboard" element={
          <ProtectedRoute currentUser={currentUser}>
            <Navigate to={currentUser?.role === 'admin' ? '/admin' : '/boarder'} replace />
          </ProtectedRoute>
        } />

        <Route path="/boarder" element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={['boarder']}>
            <BoarderView
              currentUser={currentUser}
              rooms={rooms.filter(r => !r.deleted)} // hide deleted rooms from boarders
              reservations={reservations}
              onLogout={handleLogout}
              onOpenReserve={handleOpenReserve}
              onCancelReservation={handleCancelReservation}
            />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={['admin']}>
            <AdminView
              rooms={rooms}
              reservations={reservations}
              onLogout={handleLogout}
              onApprove={handleApprove}
              onReject={handleReject}
              onUpdateRoomStatus={handleUpdateRoomStatus}
              onSaveRoom={handleSaveRoom}
              onDeleteRoom={handleDeleteRoom}
              onRestoreRoom={handleRestoreRoom}
            />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute currentUser={currentUser}>
            <Profile currentUser={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        } />

        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {activeRoom && (
        <ReserveModal
          room={activeRoom}
          currentUserName={currentUser.name}
          onClose={handleCloseReserve}
          onSubmit={handleSubmitReservation}
        />
      )}

      <Toast message={toast.message} show={toast.show} />
    </>
  );
}

// ---------- Routing helpers ----------
function ProtectedRoute({ currentUser, allowedRoles, children }) {
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/access-denied" replace />;
  }
  return children;
}

function NotFound() {
  return (
    <div className="container text-center py-5">
      <h1 className="display-1 fw-bold">404</h1>
      <p className="text-muted">Page not found.</p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="container text-center py-5">
      <h1 className="fw-bold">Access Denied</h1>
      <p className="text-muted">You do not have permission to view this page.</p>
      <Link to="/dashboard" className="btn btn-primary">Go to my dashboard</Link>
    </div>
  );
}

function Profile({ currentUser, onLogout }) {
  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <div className="card shadow-sm p-4 text-center">
        {currentUser.photoURL && (
          <img src={currentUser.photoURL} alt="Profile" referrerPolicy="no-referrer"
            className="rounded-circle mx-auto mb-3" width="96" height="96" />
        )}
        <h3>{currentUser.name}</h3>
        <p className="text-muted mb-2">{currentUser.username}</p>
        <span className="badge bg-success mx-auto mb-4 text-capitalize">{currentUser.role}</span>
        <div className="d-flex gap-2 justify-content-center">
          <Link to="/dashboard" className="btn btn-outline-secondary">Back</Link>
          <button className="btn btn-danger" onClick={onLogout}>Log out</button>
        </div>
      </div>
    </div>
  );
}