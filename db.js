const dotenv = require('dotenv');
const MongoClient = require('mongodb').MongoClient;
dotenv.config();

MongoClient.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async function (client) {
    module.exports = client;

    const db = await client.db();

    let indexesCreated = false;
    async function createIndexes(db) {
      await Promise.all([db.collection('sessions'), db.collection('users').createIndex({ email: 1, firstName: 1, lastName: 1, year: 1, username: 1 })]);
      indexesCreated = true;
    }

    if (!indexesCreated) await createIndexes(db);

    const port = process.env.PORT || 3000;
    const server = require('./server/server');
    server.listen(port, () => console.log('Listening on port ' + port));
  })
  .catch(error => console.log(error));
