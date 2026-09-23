export const CREDENTIALS = {
  boarder: { username: 'zeira', password: 'boarder123', name: 'Zeira Piana' },
  admin: { username: 'admin', password: 'admin123', name: 'Admin' }
};

export const ART_PALETTE = {
  forest: { wall: '#E1E9E4', roof: '#26433A', bed: '#26433A', accent: '#C9932E' },
  gold:   { wall: '#F5E7C7', roof: '#8F6717', bed: '#8F6717', accent: '#26433A' },
  coral:  { wall: '#F3DCD4', roof: '#7E3A2A', bed: '#7E3A2A', accent: '#3E6E77' },
  teal:   { wall: '#DCE9EB', roof: '#3E6E77', bed: '#3E6E77', accent: '#C9932E' }
};

export const initialRooms = [
  { id: 'r1', name: 'Room 101', type: 'Solo Nook · Single', price: 3500, capacity: 1, status: 'available', art: 'forest', image: 'images/room101.jpg',
    amenities: ['Free Wi-Fi', 'Own CR', 'Study table', 'Cabinet'] },
  { id: 'r2', name: 'Room 102', type: 'Solo Nook · Single', price: 3500, capacity: 1, status: 'occupied', art: 'forest', image: 'images/room102.jpg',
    amenities: ['Free Wi-Fi', 'Own CR', 'Study table', 'Cabinet'] },
  { id: 'r3', name: 'Room 201', type: 'Duo Space · Shared (2)', price: 2800, capacity: 2, status: 'available', art: 'teal', image: 'images/room201.jpg',
    amenities: ['Free Wi-Fi', 'Shared CR', 'Study table', 'Electric fan'] },
  { id: 'r4', name: 'Room 202', type: 'Duo Space · Shared (2)', price: 2800, capacity: 2, status: 'available', art: 'teal', image: 'images/room202.jpg',
    amenities: ['Free Wi-Fi', 'Shared CR', 'Aircon-ready', 'Cabinet'] },
  { id: 'r5', name: 'Room 203', type: 'Barkada Room · Shared (4)', price: 2200, capacity: 4, status: 'occupied', art: 'coral', image: 'images/room203.jpg',
    amenities: ['Free Wi-Fi', 'Shared CR', 'Study table', '24/7 security'] },
  { id: 'r6', name: 'Room 301', type: 'Duo Space · Shared (2)', price: 2800, capacity: 2, status: 'available', art: 'teal', image: 'images/room301.jpg',
    amenities: ['Free Wi-Fi', 'Own CR', 'Study table', 'Electric fan'] },
  { id: 'r7', name: 'Room 302', type: 'Solo Nook · Single with balcony', price: 3800, capacity: 1, status: 'available', art: 'gold', image: 'images/room302.jpg',
    amenities: ['Free Wi-Fi', 'Own CR', 'Balcony access', 'Cabinet'] },
  { id: 'r8', name: 'Room 303', type: 'Barkada Room · Shared (4)', price: 2200, capacity: 4, status: 'available', art: 'coral', image: 'images/room303.jpg',
    amenities: ['Free Wi-Fi', 'Shared CR', 'Study table', '24/7 security'] }
];

export const initialReservations = [
  { id: 'res1', roomId: 'r2', guestName: 'Mika Santos', contact: '0917 222 3344', moveIn: '2026-06-01', months: 6, notes: '', status: 'confirmed', username: 'mika', createdAt: '2026-05-20' },
  { id: 'res2', roomId: 'r5', guestName: 'Ana, Beth, Carla & Dana', contact: '0917 555 7788', moveIn: '2026-07-01', months: 12, notes: 'Group of 4, same barkada.', status: 'confirmed', username: 'ana', createdAt: '2026-06-10' },
  { id: 'res3', roomId: 'r6', guestName: 'Jerome Lim', contact: '0917 888 1122', moveIn: '2026-09-20', months: 8, notes: '', status: 'pending', username: 'jerome', createdAt: '2026-09-05' }
];
