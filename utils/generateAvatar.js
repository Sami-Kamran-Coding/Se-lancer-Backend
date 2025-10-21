// // utils/generateAvatar.js
// import { createCanvas } from 'canvas';

// const colors = [
//   '#1abc9c', '#2ecc71', '#3498db', '#9b59b6',
//   '#e67e22', '#e74c3c', '#34495e', '#16a085',
//   '#f39c12', '#d35400', '#8e44ad', '#2c3e50'
// ];

// export const generateAvatar = (name = '?') => {
//   const canvas = createCanvas(200, 200);
//   const ctx = canvas.getContext('2d');

//   // Random color
//   const bgColor = colors[Math.floor(Math.random() * colors.length)];
//   ctx.fillStyle = bgColor;
//   ctx.fillRect(0, 0, 200, 200);

//   // Extract first letter (ignores spaces)
//   const firstLetter = name.trim().charAt(0).toUpperCase() || '?';

//   // Text settings
//   ctx.font = 'bold 100px Arial';
//   ctx.fillStyle = '#ffffff';
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle';
//   ctx.fillText(firstLetter, 100, 110);

//   // Return Base64 data URL
//   return canvas.toDataURL('image/png');
// };


// utils/generateAvatar.js
export const generateAvatar = (name = '?') => {
  const colors = [
    '#1abc9c', '#2ecc71', '#3498db', '#9b59b6',
    '#e67e22', '#e74c3c', '#34495e', '#16a085',
    '#f39c12', '#d35400', '#8e44ad', '#2c3e50'
  ];

  const bgColor = colors[Math.floor(Math.random() * colors.length)];
  const firstLetter = name.trim().charAt(0).toUpperCase() || '?';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <rect width="100%" height="100%" fill="${bgColor}" />
      <text x="50%" y="55%" font-size="100" font-family="Arial, sans-serif"
        fill="#fff" text-anchor="middle" alignment-baseline="middle">
        ${firstLetter}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};
