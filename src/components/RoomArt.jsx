import { ART_PALETTE } from '../data/seedData';

export default function RoomArt({ paletteKey }) {
  const p = ART_PALETTE[paletteKey] || ART_PALETTE.forest;
  return (
    <svg viewBox="0 0 300 225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Room illustration">
      <rect width="300" height="225" fill={p.wall} />
      <rect x="0" y="165" width="300" height="60" fill={p.roof} opacity=".14" />
      <rect x="30" y="40" width="80" height="80" rx="4" fill="#FFFFFF" opacity=".55" />
      <line x1="70" y1="40" x2="70" y2="120" stroke={p.roof} strokeWidth="3" opacity=".4" />
      <line x1="30" y1="80" x2="110" y2="80" stroke={p.roof} strokeWidth="3" opacity=".4" />
      <rect x="150" y="120" width="120" height="65" rx="8" fill={p.bed} opacity=".85" />
      <rect x="150" y="120" width="120" height="18" rx="8" fill={p.accent} />
      <rect x="235" y="95" width="30" height="35" rx="6" fill={p.bed} opacity=".55" />
      <rect x="20" y="150" width="40" height="55" rx="4" fill={p.bed} opacity=".7" />
      <rect x="20" y="150" width="40" height="8" fill={p.accent} />
    </svg>
  );
}
