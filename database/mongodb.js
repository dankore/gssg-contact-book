const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

const startMongodb = async () => {
  try {
    const client = await MongoClient.connect(process.env.CONNECTIONSTRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    module.exports = client;

    const db = client.db();
    await createIndexes(db);

    const port = 3000;
    const server = require('../server/app');
    server.listen(port, () => {
      console.log(`🚀 🎉 GSS Gwarinpa server is now up and running on port ${port}! 🎉 🚀`);
      console.log(`The server is ready to serve all requests with grace and efficiency.`);
      console.log(`Keep an eye on the logs for any incoming requests and their status.`);
    });

  } catch (error) {
    console.error(`An error occurred: ${error}`);
    process.exit(1);
  }
};

const createIndexes = async db => {
  try {
    await Promise.all([
      db.collection('sessions'),
      db.collection('users').createIndex({
        email: 1,
        firstName: 1,
        lastName: 1,
        year: 1,
        username: 1,
      }),
    ]);
  } catch (error) {
    console.error(`An error occurred while creating indexes: ${error}`);
    process.exit(1);
  }
};

startMongodb();
