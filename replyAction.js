'use strict';

const reply = require('./api/line').reply;
const wio = require('./api/wio/');
const WebSocket = require('ws'); 

let user = {};

const action = async (WEO) => {
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
            
            // const ws = new WebSocket('wss://us.wio.seeed.io/v1/node/event');
            // ws.on('open', () => {
            //     ws.send(wioToken);
            //     console.log('websocket connect');
            // });
            // ws.on('message', (data) => {
            //     console.log(data,WEO.replyToken);
            //     let SendMessageObject = [{
            //         type: 'text',
            //         text: '人感センサに反応あり。'
            //     }];
            //     reply(WEO.replyToken,SendMessageObject).then();
            // });

        }else if(WEO.message.text === 'ヘルプ'){
            console.log(`ヘルプコマンド`);
            const ios = 'https://speakerdeck.com/n0bisuke/wionodefalsesetutoatupu-iphoneban'; 
            const android = 'https://speakerdeck.com/n0bisuke/wionodefalsesetutoatupu-androidban';
            const ouyou = 'https://i.gyazo.com/a83ceedfd879c337e84314d27fb091a3.png';
            mes = `iPhone版 ${ios} / Android版 ${android} / 応用 ${ouyou}`;
        }else if(WEO.message.text === 'アンケート'){
            console.log(`アンケートコマンド`);
            mes = `今日のアンケート https://goo.gl/forms/2VL3Z1UwZzEYvPl62`;
        }else if(user[WEO.source.userId] && WEO.message.text === '湿度'){
            console.log(`湿度コマンド`);
            const res = await wio.getWioHumidity(user[WEO.source.userId])
            console.log(res.data);
            mes = `湿度は${res.data.humidity}です。`;
        }else if(user[WEO.source.userId] && WEO.message.text === '温度'){
            console.log(`温度コマンド`);
            const res = await wio.getWioTemperature(user[WEO.source.userId])
            console.log(res.data);
            mes = `温度は${res.data.celsius_degree}です。`;
        }else if(user[WEO.source.userId] && WEO.message.text === '人感'){
            console.log(`人感コマンド`);
            let res;
            const LOOPCOUNT = 5;
            for (let i = 0; i < LOOPCOUNT; i++) {
                res = await wio.getWioPIR(user[WEO.source.userId], 'D1');
                if(res.data.approach === 1) break;
            }
            console.log(res.data);
            mes = `人感センサに反応あり。`;
            if(res.data.approach === 0) mes = `人感センサに反応なし。`; 
        }else{
            mes = '先にトークンを登録してください。'
            if(user[WEO.source.userId]) mes = `token保存済みです。温度や湿度と発言してください。`;
        }
        console.log(user);
        SendMessageObject = [{type:'text', text: mes}];
        const res = await reply(WEO.replyToken,SendMessageObject);
        console.log(res.data);
    }
}

module.exports = action;