import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

function runCommand(command, name) {
  console.log(`\n▶ ${name}`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (err) {
    console.error(`\n❌ ${name} failed. Exiting.`);
    process.exit(1);
  }
}

console.log("Starting Backend Checks...");

runCommand('npm run lint --if-present', '1/5 Lint');
runCommand('npm run build --if-present', '2/5 Build');
runCommand('npm audit --audit-level=high', '3/5 Dependency audit (high+ severity only)');

function walkDir(dir, filterExts) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath, filterExts));
    } else {
      if (filterExts.some(ext => file.endsWith(ext))) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walkDir(srcDir, ['.js', '.ts']);
const consoleRegex = /console\.(log|debug)\(/;
const secretRegex = /(api[_-]?key|secret|password|token)\s*[:=]\s*['"][A-Za-z0-9_-]{8,}['"]/;

console.log(`\n▶ 4/5 No leftover console.log in source`);
let consoleFailed = false;
files.forEach(file => {
  if (file.endsWith('logger.js') || file.endsWith('logger.ts')) return;
  const content = fs.readFileSync(file, 'utf-8');
  if (consoleRegex.test(content)) {
    console.error(`❌ Found console.log/console.debug in ${path.relative(process.cwd(), file)} — use logger.js instead.`);
    consoleFailed = true;
  }
});
if (consoleFailed) process.exit(1);

console.log(`\n▶ 5/5 No obvious hardcoded secrets in source`);
let secretFailed = false;
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (secretRegex.test(line) && !line.includes('process.env')) {
      console.error(`❌ Found a possible hardcoded secret in ${path.relative(process.cwd(), file)}:${i+1}`);
      console.error(`   ${line.trim()}`);
      console.error(`   Move it to an environment variable. Failing.`);
      secretFailed = true;
    }
  });
});
if (secretFailed) process.exit(1);

console.log("\n✅ All backend checks passed.");
