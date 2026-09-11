import fs from 'fs';
import path from 'path';
import connectDB from '../src/config/db.js';
import Lead from '../src/models/Lead.js';
import User from '../src/models/User.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from the backend root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const backup = async () => {
  await connectDB();
  
  const backupsDir = path.resolve(__dirname, '../backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir);
  }

  console.log('Fetching leads...');
  const leads = await Lead.find({});
  
  console.log('Fetching users...');
  const users = await User.find({});

  fs.writeFileSync(path.join(backupsDir, 'leads_backup.json'), JSON.stringify(leads, null, 2));
  fs.writeFileSync(path.join(backupsDir, 'users_backup.json'), JSON.stringify(users, null, 2));

  console.log(`Backup completed successfully! Saved ${leads.length} leads and ${users.length} users.`);
  process.exit(0);
};

backup().catch((err) => {
  console.error('Backup failed:', err);
  process.exit(1);
});
