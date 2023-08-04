const app2 = require('./app2');
const express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const app = express();
const testobj = { message: 'you were connected' };

//const db = test.MongoClientConnect();

//if (db.databaseName) console.log(db.databaseName);
//else console.log('NODE JS COULD NOT CONNECT TO DB');
//////////////////////////////////////////////////
const readyResponse = function (res) {
  res.setHeader('Content-Type', 'text/plain');
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://127.0.0.1:5500',
  });
};
//////////////////////////////////////////////

app.use('/', express.static('../../'));

//for testing server is live
app.get('', (req, res) => {
  console.log(req.query);

  res.setHeader('Content-Type', 'text/plain');
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://127.0.0.1:5500',
  });
  res.write(JSON.stringify(testobj));
  res.end();
});

//////////////////////////////////////////////
app.get('/create', (req, res) => {
  console.log(req.query);
  if (!req.query.owner) {
    console.log('OWNER UNDEFINED');
    return;
  }

  //for new users add an amount of 10 dollars, when they signup
  const timestamp = new Date().toISOString();
  const amt = 10;

  req.query.pin = parseInt(req.query.pin);
  req.query.movements = [amt];
  req.query.movementsDates = [timestamp];
  req.query.interestRate = parseInt(1.0);

  app2.MongoClientConnect(req.query);

  res.setHeader('Content-Type', 'text/plain');
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://127.0.0.1:5500',
  });
  res.write(JSON.stringify(testobj));
  res.end();
});
//////////////////////////////////////////////
app.get('/login', async (req, res) => {
  let acc = {};
  readyResponse(res);
  console.log(req.query, 'query');
  if (!req.query.owner) {
    console.log('OWNER UNDEFINED');
  } else {
    req.query.pin = parseInt(req.query.pin);

    acc = await app2.MongoClientLogin(req.query);
    console.log(acc, 'printed again in else of /login');
  }

  res.write(JSON.stringify(acc));
  res.end();
});
/////////////////////////////////////////////////////
app.get('/close', async (req, res) => {
  readyResponse(res);
  console.log(req.query, 'query');

  req.query.pin = parseInt(req.query.pin);

  const acc = await app2.MongoClientDelete(req.query);
  console.log(acc, 'printed in /close');

  res.write(JSON.stringify(acc));
  res.end();
});
///////////////////////////////////////////////////

app.get('/transfer', async (req, res) => {
  readyResponse(res);
  console.log(req.query, 'query');

  req.query.pin = parseInt(req.query.pin);

  const sender = await app2.MongoClientLogin(req.query);
  console.log(sender, 'sender printed in /transfer');
  console.log(typeof `${sender._id}`, `${sender._id}`);

  try {
    const receiver = await app2.MongoClientFinder(req.query.receiver);

    console.log(receiver, 'receiver in /transfer');
    const updatedSender = await app2.MongoClientUpdate(
      sender,
      receiver,
      req.query
    );
    res.write(JSON.stringify(updatedSender));
    res.end();
  } catch (err) {
    console.log(err, 'receiver in /transfer');
    res.write(JSON.stringify(err));
    res.end();
  }
});
///////////////////////////////////////////////////

app.listen(3000, () => {
  console.log('Server is up on 3000');
});
