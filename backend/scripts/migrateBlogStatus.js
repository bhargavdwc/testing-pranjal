import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import Blog from '../src/models/Blog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (process.env.FORCE_CUSTOM_DNS === 'true') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  } catch (e) {
    console.warn('Could not set custom DNS servers:', e.message);
  }
}

const migrateBlogStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || 'test',
    });
    console.log('Connected to MongoDB');

    const totalBlogs = await Blog.countDocuments();
    console.log(`Total blogs in database: ${totalBlogs}`);

    // Count how many blogs lack status
    const missingStatus = await Blog.countDocuments({
      $or: [{ status: { $exists: false } }, { status: null }, { status: '' }],
    });
    console.log(`Blogs with missing status: ${missingStatus}`);

    if (missingStatus > 0) {
      const result = await Blog.updateMany(
        { $or: [{ status: { $exists: false } }, { status: null }, { status: '' }] },
        { $set: { status: 'published' } }
      );
      console.log(`Successfully updated ${result.modifiedCount} blog(s) to status='published'.`);
    } else {
      console.log('All blogs already have a valid status field in MongoDB.');
    }

    // Print all blogs with their current status
    const allBlogs = await Blog.find({}, 'title status slug date').lean();
    console.log('\n--- Current Blogs in DB ---');
    allBlogs.forEach((b, i) => {
      console.log(`${i + 1}. [${b.status?.toUpperCase() || 'NO STATUS'}] ${b.title} (${b.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error migrating blog status:', error);
    process.exit(1);
  }
};

migrateBlogStatus();
