'use strict';

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser());

const reply = require('./reply');
const PORT = process.env.PORT || 3000;

const postAction = (req, res) => {
    console.log(req.body);
    if(req.body === ''){
        console.log('bodyが空です。');
        // return;
    }
    reply(req.body.events[0]);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('success');
}

app.post('/', postAction);
app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`Node / ${process.version}`);
});
app.listen(PORT);
console.log(`Server running at ${PORT}`);