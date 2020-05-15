const request=require("request")

const geocode=(address, callback) => {
    const url="https://api.mapbox.com/geocoding/v5/mapbox.places/"+encodeURIComponent(address)+".json?access_token=pk.eyJ1IjoibWFub2ptb3JlIiwiYSI6ImNrYTJidWhibDA4d3kzbnBubDdnOXcwcWcifQ._jcNGkutXITDrVQmBHSndQ&limit=1"
    request({url, json: true}, (error, {body})=>{
        if (error){
            callback("Unable to connect to location services", undefined)
        }else if(body.features.length===0){
            callback("Unable to find location. Please type valid location", undefined)
        }else{
            const postition= body.features[0]
            callback(undefined, {
                latitude : postition.center[1],
                longitude : postition.center[0],
                location : postition.place_name
            })
        }
    })
}

module.exports = geocode