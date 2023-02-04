print('Start #################################################################');
const dbName = 'gssg-contact-book';

db = db.getSiblingDB(dbName);
db.createUser({
  user: 'gssg_user',
  pwd: 'gssg_password',
  roles: [{ role: 'readWrite', db: dbName }],
});

db.createCollection('users');

print('END #################################################################');
