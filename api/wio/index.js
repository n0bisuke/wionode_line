'use strict';

const axios = require('axios');
const BASE_URL = 'https://us.wio.seeed.io/v1/node';

const getWioHumidity = (token) => {
    const API_PATH = `/GroveTempHumD0/humidity?access_token=${token}`;

    return axios.request({
        method: 'get',
        baseURL: BASE_URL,
        url: API_PATH,
    });
}

const getWioTemperature = (token) => {
    const API_PATH = `/GroveTempHumD1/temperature?access_token=${token}`;

    return axios.request({
        method: 'get',
        baseURL: BASE_URL,
        url: API_PATH,
    });
}

const getWioPIR = (token) => {
    const API_PATH = `/GrovePIRMotionD1/approach?access_token=${token}`;

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