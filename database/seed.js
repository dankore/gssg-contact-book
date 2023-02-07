const { MongoClient } = require('mongodb');
const { DB_CONNECTION_STRING } = require('../server/misc/helpers');
const { users } = require('./seed-users');

const seedData = async () => {
  try {
    const client = await MongoClient.connect(DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected successfully to MongoDB');
    const db = client.db();
    const usersCollection = db.collection('users');

    await usersCollection.insertMany(users);

    console.log(`Successfully seeded ${users.length} user(s)`);
    client.close();
  } catch (error) {
    console.error('An error occurred while seeding data:', error);
  }
};

seedData();
