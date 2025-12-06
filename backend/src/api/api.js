const axios = require('axios')

const base = 'http://api.weatherapi.com/v1'

exports.api = axios.create({
    baseURL: base
})