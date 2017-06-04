'use strict';

const axios = require('axios');
const crypto = require('crypto');

const CH_SECRET = process.env.SECRET || require('./config').SECRET; //Channel Secretを指定
const CH_ACCESS_TOKEN = process.env.TOKEN || require('./config').TOKEN; //Channel Access Tokenを指定
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);

const INTERVAL = 10000;

let user = {};

//プッシュ
const pushLine = (userId, SendMessageObject) => {
    const BASE_URL = 'https://api.line.me';
    const PATH = '/v2/bot/message/push';//プッシュ用

    return axios.request({
        method: 'post',
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Line-Signature': SIGNATURE,
            'Authorization': `Bearer ${CH_ACCESS_TOKEN}`
        },
        url: PATH,
        data: {to: userId, messages: SendMessageObject},
    });
}

//リプライ
const replyLine = (replyToken, SendMessageObject) => {
    const BASE_URL = 'https://api.line.me';
    const PATH = '/v2/bot/message/reply';//リプライ用

    return axios.request({
        method: 'post',
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Line-Signature': SIGNATURE,
            'Authorization': `Bearer ${CH_ACCESS_TOKEN}`
        },
        url: PATH,
        data: {replyToken: replyToken, messages: SendMessageObject},
    });
}

const getWioHumidity = (token) => {
    const BASE_URL = 'https://us.wio.seeed.io';
    const API_PATH = `/v1/node/GroveTempHumD0/humidity?access_token=${token}`;

    return axios.request({
        method: 'get',
        baseURL: BASE_URL,
        url: API_PATH,
    });
}

const getWioTemperature = (token) => {
    const BASE_URL = 'https://us.wio.seeed.io';
    const API_PATH = `/v1/node/GroveTempHumD0/temperature?access_token=${token}`;

    return axios.request({
        method: 'get',
        baseURL: BASE_URL,
        url: API_PATH,
    });
}

const getWioPIR = (token) => {
    const BASE_URL = 'https://us.wio.seeed.io';
    const API_PATH = `/v1/node/GrovePIRMotionD1/approach?access_token=${token}`;

    return axios.request({
        method: 'get',
        baseURL: BASE_URL,
        url: API_PATH,
    });
}

const reply = async (WEO) => {
    //WEO -> WebhookEventObject
    console.log(WEO.source.userId);
    
    if(WEO.type === 'message'){
        let SendMessageObject;
        if(WEO.message.type === 'text'){
            SendMessageObject = [{
                type: 'text',
                text: WEO.message.text
            }];
        }

        let wioToken = '';
        let mes = '';
        //token保存
        if(WEO.message.text.length === 32 && !user[WEO.source.userId]){
            wioToken = WEO.message.text;
            user[WEO.source.userId] = wioToken;
            mes = 'トークンを保存しました。';
            
            //人感センサの値ポーリング
            setInterval(async () => {
                const res = await getWioPIR(wioToken);
                console.log(res.data);
                //反応があった場合
                if(res.data.approach){
                    let SendMessageObject = [{type: 'text',text: '人感センサに反応あり。'}];
                    await pushLine(WEO.source.userId,SendMessageObject);
                }
            },INTERVAL);

        }else if(user[WEO.source.userId] && WEO.message.text === '湿度'){
            console.log(`湿度コマンド`);
            const res = await getWioHumidity(user[WEO.source.userId]);
            console.log(res.data);
            mes = `湿度は${res.data.humidity}です。`;
        }else if(user[WEO.source.userId] && WEO.message.text === '温度'){
            console.log(`温度コマンド`);
            const res = await getWioTemperature(user[WEO.source.userId]);
            console.log(res.data);
            mes = `温度は${res.data.celsius_degree}です。`;
        }else if(user[WEO.source.userId] && WEO.message.text === '人感'){
            console.log(`人感コマンド`);
            const res = await getWioPIR(user[WEO.source.userId]);
            console.log(res.data);
            mes = `人感センサに反応あり。`;
            if(res.data.approach) mes = `人感センサに反応なし。`; 
        }else{
            mes = '先にトークンを登録してください。'
            if(user[WEO.source.userId]) mes = `token保存済みです。温度や湿度と発言してください。`;
        }
        console.log(user);
        SendMessageObject = [{type: 'text',text: mes}];
        const res = await replyLine(WEO.replyToken,SendMessageObject);
        console.log(res.data);
    }
}

module.exports = reply;