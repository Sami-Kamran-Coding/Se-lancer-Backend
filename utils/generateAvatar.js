import { createCanvas } from 'canvas';

const colors = [
  '#1abc9c', '#2ecc71', '#3498db', '#9b59b6',
  '#e67e22', '#e74c3c', '#34495e', '#16a085',
  '#f39c12', '#d35400', '#8e44ad', '#2c3e50'
];

export const generateAvatar = (name) => {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  // Pick a random color
  const bgColor = colors[Math.floor(Math.random() * colors.length)];
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 200, 200);

  // Text setup
  ctx.font = 'bold 100px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // First letter of name
  const firstLetter = name ? name.charAt(0).toUpperCase() : '?';
  ctx.fillText(firstLetter, 100, 110);

  // Return as base64 URL
  return canvas.toDataURL();
};
