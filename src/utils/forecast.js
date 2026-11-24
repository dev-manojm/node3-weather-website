const forecast=( latitude, longitude, callback) => {
    const accessKey = process.env.WEATHERSTACK_ACCESS_KEY
    if (!accessKey) {
        callback('WEATHERSTACK_ACCESS_KEY is not configured', undefined)
        return
    }

    const url = `http://api.weatherstack.com/current?access_key=${encodeURIComponent(accessKey)}&query=${latitude},${longitude}&units=f`
    fetch(url)
        .then(response => response.json())
        .then(body => {
            if (body.error) {
                callback("unable to find location try another", undefined)
            } else {
                const current = body.current
                callback(undefined, current.weather_descriptions[0] + ". It is currently " + current.temperature + "  fahrenheit(s) out there. It feels like " + current.feelslike + " out here. And " + current.humidity + " is the humidity")
            }
        })
        .catch(() => callback("unable to connect to location services", undefined))
}

module.exports = forecast
