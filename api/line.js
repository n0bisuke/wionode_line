'use strict';

const axios = require('axios');
const crypto = require('crypto');

const CH_SECRET = process.env.SECRET || require('../config').SECRET; //Channel Secretを指定
const CH_ACCESS_TOKEN = process.env.TOKEN || require('../config').TOKEN; //Channel Access Tokenを指定
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);

const BASE_URL = 'https://api.line.me';
const HEADERS = {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Line-Signature': SIGNATURE,
    'Authorization': `Bearer ${CH_ACCESS_TOKEN}`
}

//リプライ
const reply = (replyToken, SendMessageObject) => {
    const PATH = '/v2/bot/message/reply';//リプライ用

    return axios.request({
        method: 'post',
        baseURL: BASE_URL,
        headers: HEADERS,
        url: PATH,
        data: {replyToken: replyToken, messages: SendMessageObject},
    });
}

//プッシュ
const push = (userId, SendMessageObject) => {
    const PATH = '/v2/bot/message/push';//プッシュ用

    return axios.request({
        method: 'post',
        baseURL: BASE_URL,
        headers: HEADERS,
        url: PATH,
        data: {to: userId, messages: SendMessageObject},
    });
}

module.exports = {
    reply: reply,
    push: push
};