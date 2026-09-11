import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import Lead from '../src/models/Lead.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (process.env.FORCE_CUSTOM_DNS === 'true') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (e) {
    console.warn('Could not set custom DNS servers:', e.message);
  }
}

const migrateLeads = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Removing zoomLink, zoomDate, whatsappAdded, and statusHistory fields from all Leads...');

    const result = await Lead.collection.updateMany(
      {},
      {
        $unset: {
          zoomLink: "",
          zoomDate: "",
          whatsappAdded: "",
          statusHistory: ""
        }
      }
    );

    console.log(`Migration completed successfully!`);
    console.log(`Matched documents: ${result.matchedCount}`);
    console.log(`Modified documents: ${result.modifiedCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error running migration:', error);
    process.exit(1);
  }
};

migrateLeads();
