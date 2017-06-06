'use strict';

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser());

const replyAction = require('./replyAction');
const reply = require('./api/line').reply;
const PORT = process.env.PORT || 3000;

const postAction = (req, res) => {
    // console.log(req.body);
    if(req.body === '') { //bodyが空
        res.end('success');
        return;
    }

    replyAction(req.body.events[0]).catch(err=> {
        const mes = `センサーの接続やネットワークを確認して下さい。`;
        reply(req.body.events[0].replyToken, [{type: 'text',text: mes}]).then();
        console.log(err.data);
    });
    
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('success');
}

app.post('/', postAction);
app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`Node update! / ${process.version}`);
});
app.listen(PORT);

console.log(`Server running at ${PORT}`);