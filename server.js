'use strict';

const http = require('http');
const crypto = require('crypto');
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser());

const BASE_URL = 'https://api.line.me';
const REPLY_PATH = '/v2/bot/message/reply';//リプライ用
const CH_SECRET = process.env.SECRET || ''; //Channel Secretを指定
const CH_ACCESS_TOKEN = process.env.TOKEN || ''; //Channel Access Tokenを指定
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);
const PORT = process.env.PORT || 3000;

const main = (req, res) => {
    console.log(req.body);
    if(req.body === ''){
        console.log('bodyが空です。');
        return;
    }
    
    let WebhookEventObject = JSON.parse(req.body).events[0];

    //メッセージが送られて来た場合
    if(WebhookEventObject.type === 'message'){
        let SendMessageObject;
        if(WebhookEventObject.message.type === 'text'){
            SendMessageObject = [{
                type: 'text',
                text: WebhookEventObject.message.text
            }];
        }

        axios.request({
            method: 'post',
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Line-Signature': SIGNATURE,
                'Authorization': `Bearer ${CH_ACCESS_TOKEN}`
            },
            url: REPLY_PATH,
            data: {replyToken: WebhookEventObject.replyToken, messages: SendMessageObject},
        }).then((res) => {
            console.log(res.status);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('success');
}

app.post('/', main);
app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`${process.version}`);
});
app.listen(PORT);
console.log(`Server running at ${PORT}`);