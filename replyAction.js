'use strict';

const reply = require('./api/line').reply;
const wio = require('./api/wio/');
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
            
            //人感センサの値ポーリング
            // setInterval(async () => {
            //     const res = await getWioPIR(wioToken);
            //     console.log(res.data);
            //     //反応があった場合
            //     if(res.data.approach){
            //         let SendMessageObject = [{type: 'text',text: '人感センサに反応あり。'}];
            //         await pushLine(WEO.source.userId,SendMessageObject);
            //     }
            // },INTERVAL);

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
            const res = await wio.getWioPIR(user[WEO.source.userId])
            console.log(res.data);
            mes = `人感センサに反応あり。`;
            if(res.data.approach) mes = `人感センサに反応なし。`; 
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