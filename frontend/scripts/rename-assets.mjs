import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');

const renameMap = [
  // Thumbnails
  {
    from: 'public/thumbnail/image (2).jpg',
    to: 'public/thumbnail/about-video-thumbnail.jpg',
  },
  {
    from: 'public/thumbnail/image (3).jpg',
    to: 'public/thumbnail/program-intro-thumbnail.jpg',
  },
  // Videos
  {
    from: 'public/video/1.mp4',
    to: 'public/video/cohort-session-clip-01.mp4',
  },
  {
    from: 'public/video/2.mp4',
    to: 'public/video/cohort-session-clip-02.mp4',
  },
  {
    from: 'public/video/3.mp4',
    to: 'public/video/cohort-session-clip-03.mp4',
  },
  {
    from: 'public/video/4.mp4',
    to: 'public/video/cohort-session-clip-04.mp4',
  },
  // Pranjal Sarkar images
  {
    from: 'src/assets/pranjalsarkar/18.webp',
    to: 'src/assets/pranjalsarkar/pranjal-sarkar-portrait.webp',
  },
  {
    from: 'src/assets/pranjalsarkar/for mobile.png',
    to: 'src/assets/pranjalsarkar/pranjal-sarkar-cta-mobile.png',
  },
  {
    from: 'src/assets/pranjalsarkar/imagep.png',
    to: 'src/assets/pranjalsarkar/pranjal-sarkar-about-headshot.png',
  },
  {
    from: 'src/assets/pranjalsarkar/Untitled design.png',
    to: 'src/assets/pranjalsarkar/pranjal-sarkar-cta-desktop.png',
  },
  // Events
  {
    from: 'public/events/20251120_143802.webp',
    to: 'public/events/Pranjal-Sarkar-Delivering-Session-10.webp',
  },
  {
    from: 'public/events/20251120_144745.webp',
    to: 'public/events/Pranjal-Sarkar-Delivering-Session-11.webp',
  },
  {
    from: 'public/events/20251120_144814.webp',
    to: 'public/events/Pranjal-Sarkar-Delivering-Session-12.webp',
  },
  {
    from: 'public/events/20251120_152313.webp',
    to: 'public/events/Pranjal-Sarkar-Delivering-Session-13.webp',
  },
  {
    from: 'public/events/20251120_155544.webp',
    to: 'public/events/Pranjal-Sarkar-Delivering-Session-14.webp',
  },
];

console.log('Renaming media assets to clean, descriptive names...\n');

let count = 0;
for (const item of renameMap) {
  const oldPath = path.join(frontendDir, item.from);
  const newPath = path.join(frontendDir, item.to);

  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`[RENAMED] ${item.from} -> ${item.to}`);
    count++;
  } else if (fs.existsSync(newPath)) {
    console.log(`[ALREADY RENAMED] ${item.to} already exists.`);
  } else {
    console.warn(`[NOT FOUND] ${item.from}`);
  }
}

console.log(`\nCompleted. ${count} files renamed.`);
