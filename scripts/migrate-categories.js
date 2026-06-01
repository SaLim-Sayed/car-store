const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Read env variables
const envPath = path.join(__dirname, '../.env.local');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (err) {
  console.error('Could not read .env.local file', err);
  process.exit(1);
}

const mongoUriLine = envContent.split('\n').find(line => line.trim().startsWith('MONGODB_URI='));
if (!mongoUriLine) {
  console.error('No MONGODB_URI found in .env.local');
  process.exit(1);
}

const uri = mongoUriLine.split('MONGODB_URI=')[1].trim();

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected successfully to database server.');
    const db = client.db();
    
    // Mongoose pluralizes "Equipment" model to "equipments" collection
    const collection = db.collection('equipments');
    
    // Check how many documents match the old category
    const count = await collection.countDocuments({ category: 'دراجات نارية' });
    console.log(`Found ${count} documents with category 'دراجات نارية'.`);
    
    if (count > 0) {
      const result = await collection.updateMany(
        { category: 'دراجات نارية' },
        { $set: { category: 'دراجات نارية - توك توك - تروسيكل' } }
      );
      console.log(`Successfully migrated ${result.modifiedCount} documents.`);
    } else {
      console.log('No migration needed.');
    }
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    await client.close();
  }
}

run();
