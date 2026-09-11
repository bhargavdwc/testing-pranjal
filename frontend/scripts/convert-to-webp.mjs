import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');

const targetDirs = [
  path.join(frontendDir, 'src', 'assets'),
  path.join(frontendDir, 'public'),
];

function getFilesRecursively(dir, filterExtensions) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, filterExtensions));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (filterExtensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function convertAll() {
  console.log('Starting conversion of PNG and JPG/JPEG images to WebP...\n');

  let allFiles = [];
  for (const dir of targetDirs) {
    allFiles = allFiles.concat(getFilesRecursively(dir, ['.png', '.jpg', '.jpeg']));
  }

  if (allFiles.length === 0) {
    console.log('No PNG/JPG files found to convert.');
    return;
  }

  console.log(`Found ${allFiles.length} images to convert.\n`);

  let totalOldSize = 0;
  let totalNewSize = 0;
  let convertedCount = 0;

  for (const filePath of allFiles) {
    const ext = path.extname(filePath);
    const baseName = path.basename(filePath, ext);
    const dir = path.dirname(filePath);
    const webpPath = path.join(dir, `${baseName}.webp`);

    const oldStat = fs.statSync(filePath);
    const oldSize = oldStat.size;
    totalOldSize += oldSize;

    try {
      await sharp(filePath)
        .webp({ quality: 85, effort: 4 })
        .toFile(webpPath);

      const newStat = fs.statSync(webpPath);
      const newSize = newStat.size;
      totalNewSize += newSize;

      // Remove the old file
      fs.unlinkSync(filePath);

      const relOld = path.relative(frontendDir, filePath).replace(/\\/g, '/');
      const relNew = path.relative(frontendDir, webpPath).replace(/\\/g, '/');
      const savedPct = Math.round(((oldSize - newSize) / oldSize) * 100);

      console.log(`✓ ${relOld} -> ${relNew} (${(oldSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB, saved ${savedPct}%)`);
      convertedCount++;
    } catch (err) {
      console.error(`✗ Error converting ${filePath}:`, err.message);
    }
  }

  const savedTotalMB = ((totalOldSize - totalNewSize) / (1024 * 1024)).toFixed(2);
  console.log(`\n🎉 Successfully converted ${convertedCount} images to WebP!`);
  console.log(`Total original size: ${(totalOldSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total new WebP size: ${(totalNewSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Space saved: ${savedTotalMB} MB (${Math.round(((totalOldSize - totalNewSize) / totalOldSize) * 100)}% reduction)\n`);
}

convertAll();
