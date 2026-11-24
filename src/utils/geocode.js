const geocode=(address, callback) => {
    const accessToken = process.env.MAPBOX_ACCESS_TOKEN
    if (!accessToken) {
        callback('MAPBOX_ACCESS_TOKEN is not configured', undefined)
        return
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${encodeURIComponent(accessToken)}&limit=1`
    fetch(url)
        .then(response => response.json())
        .then(body => {
            if (body.features.length === 0) {
                callback("Unable to find location. Please type valid location", undefined)
            } else {
                const position = body.features[0]
                callback(undefined, {
                    latitude: position.center[1],
                    longitude: position.center[0],
                    location: position.place_name
                })
            }
        })
        .catch(() => callback("Unable to connect to location services", undefined))
}

module.exports = geocode