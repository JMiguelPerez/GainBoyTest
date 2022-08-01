const MongoClient = require('mongodb').MongoClient;
const url = 'https://account.mongodb.com/account/login?n=%2Fv2%2F62b63731b526d47fc7937c8e%23metrics%2FreplicaSet%2F62bc7987f522db2ecacdac74%2Fexplorer%2Fdev%2Fworkouts%2Ffind'
const client = new MongoClient(url);
client.connect();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});
app.listen(5000); // start Node + Express server on port 5000