const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

// SVG logo definition
const logoSvg = `
<svg width="512" height="512" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#2563eb"/>
  <path d="M12 6L16 8.5M12 6V12M12 6L8 8.5M12 12L16 9.5M12 12V18M12 12L8 9.5M12 18L16 15.5M12 18L8 15.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
`;

// Ensure directories exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the SVG file
fs.writeFileSync(path.join(publicDir, 'logo.svg'), logoSvg);

// Asset configurations
const assets = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'logo192.png', size: 192 },
  { name: 'logo512.png', size: 512 },
  { name: 'maskable_icon.png', size: 512, padding: 102 }, // 20% safe area for maskable icon
  { name: 'og-image.png', width: 1200, height: 630, special: 'og' },
  { name: 'screenshot1.png', width: 1280, height: 720, special: 'screenshot' }
];

// Generate favicon.ico (multi-size icon)
console.log('Generating favicon.ico...');
execSync(`convert ${path.join(publicDir, 'logo.svg')} -define icon:auto-resize=16,32,48 ${path.join(publicDir, 'favicon.ico')}`);

// Function to create social preview image
async function createSocialPreview(width, height, outputPath) {
  const canvas = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  });

  // Create a gradient background
  const gradientBuffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 37, g: 99, b: 235, alpha: 0.1 } // primary-600 with 0.1 opacity
    }
  }).png().toBuffer();

  // Resize logo for overlay
  const logoSize = height * 0.4;
  const resizedLogo = await sharp(path.join(publicDir, 'logo.svg'))
    .resize(Math.round(logoSize), Math.round(logoSize))
    .toBuffer();

  // Compose the final image
  await canvas
    .composite([
      { input: gradientBuffer, blend: 'over' },
      {
        input: resizedLogo,
        top: Math.round((height - logoSize) / 2),
        left: Math.round((width - logoSize) / 2)
      }
    ])
    .png()
    .toFile(outputPath);
}

// Function to create screenshot
async function createScreenshot(width, height, outputPath) {
  const canvas = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 249, g: 250, b: 251, alpha: 1 } // gray-50
    }
  });

  // Create a header gradient
  const headerHeight = Math.round(height * 0.3);
  const headerBuffer = await sharp({
    create: {
      width,
      height: headerHeight,
      channels: 4,
      background: { r: 37, g: 99, b: 235, alpha: 1 } // primary-600
    }
  }).png().toBuffer();

  // Resize logo for overlay
  const logoSize = headerHeight * 0.6;
  const resizedLogo = await sharp(path.join(publicDir, 'logo.svg'))
    .resize(Math.round(logoSize), Math.round(logoSize))
    .toBuffer();

  // Compose the final image
  await canvas
    .composite([
      { input: headerBuffer, top: 0, left: 0 },
      {
        input: resizedLogo,
        top: Math.round((headerHeight - logoSize) / 2),
        left: Math.round((width - logoSize) / 2)
      }
    ])
    .png()
    .toFile(outputPath);
}

// Generate all assets
async function generateAssets() {
  console.log('Generating assets...');

  for (const asset of assets) {
    const outputPath = path.join(publicDir, asset.name);
    console.log(`Generating ${asset.name}...`);

    if (asset.special === 'og') {
      await createSocialPreview(asset.width, asset.height, outputPath);
    } else if (asset.special === 'screenshot') {
      await createScreenshot(asset.width, asset.height, outputPath);
    } else {
      const size = asset.size;
      let pipeline = sharp(path.join(publicDir, 'logo.svg'))
        .resize(size, size);

      if (asset.padding) {
        // Add padding for maskable icon
        pipeline = pipeline.extend({
          top: asset.padding,
          bottom: asset.padding,
          left: asset.padding,
          right: asset.padding,
          background: { r: 37, g: 99, b: 235, alpha: 1 } // primary-600
        });
      }

      await pipeline.png().toFile(outputPath);
    }
  }

  console.log('All assets generated successfully!');
}

generateAssets().catch(console.error); 