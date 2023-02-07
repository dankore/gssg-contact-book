const { MongoClient } = require('mongodb');
const { DB_CONNECTION_STRING } = require('../server/misc/helpers');

const seedData = async () => {
  try {
    const client = await MongoClient.connect(DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected successfully to MongoDB');
    const db = client.db();
    const usersCollection = db.collection('users');

    const users = [];
    const firstNames = ['Hassan', 'Hussain', 'Fatima', 'Aisha', 'Abbas'];
    const lastNames = ['Mohammed', 'Mustapha', 'Yusuf', 'Nura', 'Rabe'];

    for (let i = 0; i < 100; i++) {
      users.push({
        firstName: firstNames[i % 5],
        lastName: lastNames[i % 5],
        year: 1990 + i,
        email: `${firstNames[i % 5].toLowerCase()}.${lastNames[i % 5].toLowerCase()}${i}@example.com`,
        comments: [],
        username: `${firstNames[i % 5].toLowerCase()}${lastNames[i % 5].toLowerCase()}${i}`,
      });
    }

    await usersCollection.insertMany(users);

    console.log(`Successfully seeded ${users.length} user(s)`);
    client.close();
  } catch (error) {
    console.error('An error occurred while seeding data:', error);
  }
};

seedData();
