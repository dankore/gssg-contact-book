const { MongoClient } = require('mongodb');
const { DB_CONNECTION_STRING } = require('../server/misc/helpers');
const { users } = require('./seed-users');
const User = require('../server/models/user');

const seedData = async () => {
  try {
    // const client = await MongoClient.connect(DB_CONNECTION_STRING, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    // console.log('Connected successfully to MongoDB');
    // const db = client.db();
    // const usersCollection = db.collection('users');

    for (const userData of users) {
      const user = new User(userData);
      await user.register();
    }

    console.log(`Successfully seeded ${users.length} user(s)`);
    client.close();
  } catch (error) {
    console.error('An error occurred while seeding data:', error);
  }
};

seedData();
