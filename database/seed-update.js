const { MongoClient } = require('mongodb');
const { DB_CONNECTION_STRING } = require('../server/misc/helpers');
const { users } = require('./seed-users');

const updateData = async () => {
  try {
    const client = await MongoClient.connect(DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected successfully to MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');

    const updates = users.map(user => {
      const query = { firstName: user.firstName, lastName: user.lastName };
      const update = { $set: { email: user.email } };

      return usersCollection.updateOne(query, update);
    });

    const results = await Promise.all(updates);
    results.forEach((result, index) => {
      console.log(`For user ${users[index].firstName} ${users[index].lastName}:`);
      console.log(`${result.matchedCount} document(s) matched the query criteria`);
      console.log(`${result.modifiedCount} document(s) were updated\n`);
    });

    client.close();
  } catch (error) {
    console.error('An error occurred while updating data:', error);
  }
};

updateData();
