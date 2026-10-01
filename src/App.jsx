import { useState, useRef, useEffect } from 'react';
import Login from './components/Login';
import BoarderView from './components/BoarderView';
import AdminView from './components/AdminView';
import ReserveModal from './components/ReserveModal';
import Toast from './components/Toast';
import { initialRooms, initialReservations } from './data/seedData';
import './App.css'
import RoomsTable from './components/RoomsDataTable';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [rooms, setRooms] = useState(initialRooms);
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

  function handleLogin(user) {
    setCurrentUser(user);
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
    if (currentUser && currentUser.provider === 'google') {
      await signOut(auth);
    }
    setCurrentUser(null);
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
      setRooms(prev => prev.map(r => r.id === res.roomId ? { ...r, status: 'occupied' } : r));
    }
    showToast('Reservation confirmed.');
  }

  function handleReject(id) {
    const res = reservations.find(r => r.id === id);
    const wasConfirmed = res && res.status === 'confirmed';
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
    if (wasConfirmed && res) {
      setRooms(prev => prev.map(r => r.id === res.roomId ? { ...r, status: 'available' } : r));
    }
    showToast(wasConfirmed ? 'Reservation cancelled.' : 'Reservation rejected.');
  }

  function handleUpdateRoomStatus(roomId, status) {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status } : r));
    const room = rooms.find(r => r.id === roomId);
    showToast((room ? room.name : 'Room') + ' updated to ' + status + '.');
  }

  // NEW: save edited room details (name, type, price, capacity, amenities)
  function handleSaveRoom(roomId, formData) {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, ...formData } : r));
    showToast(formData.name + ' updated.');
  }

  const activeRoom = rooms.find(r => r.id === activeReserveRoomId);

  if (authLoading) return <h2>Loading Application State...</h2>;

  return (
    <>
      {!currentUser && <Login onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} />}

      {currentUser && currentUser.role === 'boarder' && (
        <BoarderView
          currentUser={currentUser}
          rooms={rooms}
          reservations={reservations}
          onLogout={handleLogout}
          onOpenReserve={handleOpenReserve}
          onCancelReservation={handleCancelReservation}
        />
      )}

      {currentUser && currentUser.role === 'admin' && (
        <AdminView
          rooms={rooms}
          reservations={reservations}
          onLogout={handleLogout}
          onApprove={handleApprove}
          onReject={handleReject}
          onUpdateRoomStatus={handleUpdateRoomStatus}
          onSaveRoom={handleSaveRoom} // NEW
        />
      )}

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