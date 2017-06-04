'use strict';

const axios = require('axios');
const crypto = require('crypto');

const BASE_URL = 'https://api.line.me';
const REPLY_PATH = '/v2/bot/message/reply';//リプライ用
const CH_SECRET = process.env.SECRET || require('./config').SECRET; //Channel Secretを指定
const CH_ACCESS_TOKEN = process.env.TOKEN || require('./config').TOKEN; //Channel Access Tokenを指定
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);

const reply = (WebhookEventObject) => {

    // let WebhookEventObject = req.body.events[0];

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
};

module.exports = reply;