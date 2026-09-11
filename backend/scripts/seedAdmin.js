import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import User from '../src/models/User.js';

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

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const primaryAdmin = process.env.PRIMARY_SUPER_ADMIN_EMAIL || 'office@pranjalsarkar.com';
    const directAdmin = process.env.ADMIN_DIRECT_LOGIN_EMAIL;

    const admins = [
      { email: primaryAdmin, role: 'super_admin' },
      ...(directAdmin ? [{ email: directAdmin, role: 'super_admin' }] : []),
    ];

    for (const admin of admins) {
      let user = await User.findOne({ email: admin.email });
      if (user) {
        console.log(`${admin.role} already exists:`, user.email);
      } else {
        user = new User({
          email: admin.email,
          role: admin.role,
        });
        await user.save();
        console.log(`✅ Successfully created ${admin.role}:`, user.email);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
