'use strict';

const getWioPIR = (token) => {
    const BASE_URL = 'https://us.wio.seeed.io';
    const API_PATH = `/v1/node/GrovePIRMotionD1/approach?access_token=${token}`;

    return axios.request({
        method: 'get',
        baseURL: BASE_URL,
        url: API_PATH,
    });
}

module.exports = getWioPIR;