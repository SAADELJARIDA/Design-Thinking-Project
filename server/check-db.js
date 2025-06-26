require('dotenv').config();
const mongoose = require('mongoose');

// Parse the MongoDB URI to extract database name
const uri = process.env.MONGO_URI;
console.log('MongoDB URI:', uri);

// Extract database name if present
let dbName = 'Not specified in URI';
try {
  // Check if URI has a database name after the hostname
  const dbPart = uri.split('mongodb+srv://')[1].split('/')[1];
  if (dbPart) {
    dbName = dbPart.split('?')[0];
  } 
} catch(e) {
  console.log('Error parsing URI:', e.message);
}

console.log('Database Name from URI:', dbName || 'Not specified in URI');
console.log('If no database is specified, MongoDB will use the default "test" database');

// Attempt to connect
console.log('\nAttempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    console.log('Current database:', mongoose.connection.db.databaseName);
    
    // List available collections
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
    console.log('\nAvailable collections:');
    if (collections.length === 0) {
      console.log('No collections found. This is normal for a new database.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Connection error:', err.message);
  })
  .finally(() => {
    console.log('\nCheck completed.');
  }); 