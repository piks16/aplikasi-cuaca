const request = require('postman-request')

// Ganti API_KEY_DISINI dengan API key Weatherstack Anda
// Dapatkan dari: https://weatherstack.com/
const API_KEY = '5f32c154dd0b5f5d03e7d89abf3bfc9e'

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=' + API_KEY + '&query=' + encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude) + '&units=m'
    
    request({ url: url, json: true }, (error, response) => {
        if (error) {
            callback('Tidak dapat terkoneksi ke layanan cuaca!', undefined)
        } else if (response.body.error) {
            callback('Tidak dapat menemukan lokasi untuk prediksi cuaca!', undefined)
        } else {
            const current = response.body.current
            callback(undefined,
                'Info Cuaca: ' + current.weather_descriptions[0] + '. ' +
                'Suhu saat ini adalah ' + current.temperature + ' derajat. ' +
                'Terasa seperti ' + current.feelslike + ' derajat. ' +
                'Kelembaban: ' + current.humidity + '%.'
            )
        }
    })
}

module.exports = forecast