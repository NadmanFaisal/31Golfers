const { api } = require('./api')

const API_KEY = process.env.WEATHER_API_KEY

exports.get_weather = async () => {
    // Fetch data for 7 days
    const response = await api.get(`/forecast.json?key=${API_KEY}&q=Dhaka&days=7`)
    console.log(response.data.forecast.forecastday)
}