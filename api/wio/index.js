'use strict';

const axios = require('axios');
const BASE_URL = 'https://us.wio.seeed.io/v1/node';

const getWioHumidity = (token, pin = 'D0') => {
    const API_PATH = `/GroveTempHum${pin}/humidity?access_token=${token}`;

    return axios.request({
        method: 'get',
        baseURL: BASE_URL,
        url: API_PATH,
    });
}

const getWioTemperature = (token, pin = 'D0') => {
    const API_PATH = `/GroveTempHum${pin}/temperature?access_token=${token}`;

    return axios.request({
        method: 'get',
        baseURL: BASE_URL,
        url: API_PATH,
    });
}

const getWioPIR = (token, pin = 'D0') => {
    const API_PATH = `/GrovePIRMotion${pin}/approach?access_token=${token}`;

    return axios.request({
        method: 'get',
        baseURL: BASE_URL,
        url: API_PATH,
    });
}

module.exports = {
    getWioPIR:getWioPIR,
    getWioHumidity:getWioHumidity,
    getWioTemperature:getWioTemperature
}