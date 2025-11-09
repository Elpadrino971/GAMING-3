/**
 * Generate PWA Icons
 * Run with: node scripts/generate-icons.js
 *
 * This script generates placeholder icons for the PWA.
 * For production, replace with professionally designed icons.
 */

const fs = require('fs');
const path = require('path');

// SVG template for the icon
const generateSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#grad)"/>

  <!-- Poker chip outer ring -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2.5}" fill="none" stroke="#047857" stroke-width="${size/20}"/>

  <!-- Center circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/4}" fill="#047857"/>

  <!-- Card symbols -->
  <text x="${size/2}" y="${size/2 + size/12}"
        font-family="Arial"
        font-size="${size/4}"
        fill="white"
        text-anchor="middle"
        font-weight="bold">♠</text>
</svg>
`;

// Generate icon files
const sizes = [192, 512];
const publicDir = path.join(__dirname, '../public');

console.log('🎨 Generating PWA icons...\n');

sizes.forEach(size => {
  const svg = generateSVG(size);
  const filename = `icon-${size}.svg`;
  const filepath = path.join(publicDir, filename);

  fs.writeFileSync(filepath, svg);
  console.log(`✅ Generated ${filename}`);
});

console.log('\n📝 Note: SVG icons created. For production:');
console.log('   1. Use a tool like Figma or Illustrator to create PNG versions');
console.log('   2. Or use an online converter to convert SVG to PNG');
console.log('   3. Ensure icons have transparent backgrounds');
console.log('   4. Replace icon-192.svg and icon-512.svg with icon-192.png and icon-512.png\n');

console.log('✨ Done! Your PWA icons are ready.\n');
