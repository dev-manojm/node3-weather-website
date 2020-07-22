const request=require("request")

const forecast=( latitude, longitude, callback) => {
    const url="http://api.weatherstack.com/current?access_key=25b1a37b0a5376dedb3cbb3106673770&query=" +latitude + "," + longitude+ "&units=f"
    request({url, json: true}, (error, {body})=>{
        if (error){
            callback("unable to connect to location services", undefined)
        }else if(body.error){
            callback("unable to find location try another", undefined)
        }else{
            const current =body.current

            callback(undefined,current.weather_descriptions[0]+ ". It is currently "+ current.temperature +"  fahrenheit(s) out there. It feels like "+current.feelslike+ " out here. And "+current.humidity+" is the humidity")
        }
    })
}

module.exports = forecast
