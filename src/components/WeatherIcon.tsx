import React from 'react';

const WeatherIcon: React.FC<{ code?: number; size?: number }> = ({ code, size }) => {
  if (code === 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="10" fill="#FFD700" /></svg>
    );
  }
  if (code === 2 || code === 3) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="20" rx="10" ry="6" fill="#B0C4DE" /><circle cx="12" cy="14" r="6" fill="#FFD700" /></svg>
    );
  }
  if (code === 45 || code === 48) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="20" rx="10" ry="6" fill="#B0C4DE" /><rect x="6" y="24" width="20" height="4" fill="#A9A9A9" /></svg>
    );
  }
  if (code === 61 || code === 63 || code === 65 || code === 80 || code === 81 || code === 82) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="20" rx="10" ry="6" fill="#B0C4DE" /><line x1="10" y1="28" x2="10" y2="32" stroke="#00BFFF" strokeWidth="2" /><line x1="22" y1="28" x2="22" y2="32" stroke="#00BFFF" strokeWidth="2" /></svg>
    );
  }
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="20" rx="10" ry="6" fill="#B0C4DE" /><circle cx="10" cy="28" r="2" fill="#ADD8E6" /><circle cx="22" cy="28" r="2" fill="#ADD8E6" /></svg>
    );
  }
  if (code === 95 || code === 96 || code === 99) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="20" rx="10" ry="6" fill="#B0C4DE" /><polygon points="16,24 18,28 14,28" fill="#FFD700" /><line x1="16" y1="28" x2="16" y2="32" stroke="#FFD700" strokeWidth="2" /></svg>
    );
  }
  // Default: cloud
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="20" rx="10" ry="6" fill="#B0C4DE" /></svg>
  );
};

export default WeatherIcon;
