const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connURL = 'mongodb://127.0.0.1:27017';
const dbname = 'accholders';

const MongoClientConnect = function (query) {
  MongoClient.connect(
    connURL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error, client) => {
      if (error) {
        console.log('ERR CONNECTING TO DB in CREATE');
        return;
      }
      db = client.db(dbname);
      db.collection('users').insertOne(query);
    }
  );
};
const MongoClientLogin = function (query) {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(
      connURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (error, client) => {
        if (error) {
          console.log('ERR CONNECTING TO DB in LOGIN');
          resolve({});
        } else {
          const db = client.db(dbname);
          db.collection('users').findOne(
            { owner: query.owner, pin: query.pin },
            (error, account) => {
              if (error || !account) {
                console.log('ERROR IN CONNECTING TO DB in LOGIN OR NOT FOUND');
                resolve({});
              } else {
                console.log(account, 'acc in MongoClientLogin', account.owner);
                resolve(account);
              }
            }
          );
        }
      }
    );
  });
};
const MongoClientDelete = function (query) {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(
      connURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (error, client) => {
        if (error) {
          console.log('ERR CONNECTING TO DB in DELETE');
          reject({ message: 'rejected' });
        } else {
          const db = client.db(dbname);
          db.collection('users').deleteOne(
            { owner: query.owner, pin: query.pin },
            (error, result) => {
              if (error) {
                console.log('ERROR IN DELETING');
                reject({ message: 'rejected' });
              } else {
                console.log(result, 'in MongoDelete');
                resolve({ message: 'resolved' });
              }
            }
          );
        }
      }
    );
  });
};
const MongoClientFinder = function (query) {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(
      connURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (error, client) => {
        if (error) {
          console.log('ERR CONNECTING TO DB in LOGIN');
          reject({ message: 'rejected' });
        } else {
          const db = client.db(dbname);
          db.collection('users').findOne({ owner: query }, (error, account) => {
            if (error || !account) {
              console.log('ERROR IN CONNECTING TO DB in LOGIN OR NOT FOUND');
              reject({ message: 'rejected' });
            } else {
              console.log(
                account,
                'receiver in MongoClientLogin',
                account.owner
              );
              resolve(account);
            }
          });
        }
      }
    );
  });
};

const MongoClientUpdate = function (sender, receiver, query) {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(
      connURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (error, client) => {
        if (error) {
          console.log('ERR CONNECTING TO DB in LOGIN');
          reject({ message: 'rejected' });
        } else {
          const db = client.db(dbname);

          const smovements = sender.movements;
          const smovementsDates = sender.movementsDates;
          const rmovements = receiver.movements;
          const rmovementsDates = receiver.movementsDates;

          smovements.push(-parseFloat(query.amt));
          rmovements.push(parseFloat(query.amt));
          smovementsDates.push(query.timestamp);
          rmovementsDates.push(query.timestamp);

          console.log(smovementsDates, rmovementsDates);

          sender.movements = smovements;
          sender.movementsDates = smovementsDates;

          db.collection('users')
            .updateOne(
              { _id: new mongodb.ObjectId(`${sender._id}`) },
              {
                $set: {
                  movements: smovements,
                  movementsDates: smovementsDates,
                },
              }
            )
            .then(() => {
              console.log('sender updated');
              db.collection('users')
                .updateOne(
                  { _id: new mongodb.ObjectId(`${receiver._id}`) },
                  {
                    $set: {
                      movements: rmovements,
                      movementsDates: rmovementsDates,
                    },
                  }
                )
                .then(() => {
                  console.log('receiver updated');
                  resolve({ message: 'resolved', account: sender });
                });
            })
            .catch(() => reject({ message: 'rejected' }));
        }
      }
    );
  });
};

module.exports = {
  MongoClientConnect: MongoClientConnect,
  MongoClientLogin: MongoClientLogin,
  MongoClientDelete: MongoClientDelete,
  MongoClientFinder: MongoClientFinder,
  MongoClientUpdate: MongoClientUpdate,
};

console.log('DONE');

/*const saccount = {
  _id: '609accdfc20a4b9723ca7687',
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const raccount = {
  _id: `60994f6c3e73a152c4b5fa6e`,
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};
MongoClientUpdate(saccount, raccount, {
  amt: 220,
  timestamp: 'time',
});*/
