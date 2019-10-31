const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const moment = require('moment');

app.use(bodyParser());

const port = 3000;

const SocketServer = require('./src/SocketServer');

let socketServer;

app.get('/ping', (req, res) => {
  res.send('pong');
});

let server = app.listen(port, () => console.log(`Listening at port ${port}`));

socketServer = new SocketServer(server);

module.exports = {app, server};
