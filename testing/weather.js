const forecast = {
    "coord":{
        "lon":-0.1257,
        "lat":51.5085
    },
    "weather":[{
            "id":804,
            "main":"Clouds",
            "description":"overcast clouds",
            "icon":"04d"
    }],
    "base":"stations",
    "main":{
        "temp":294.25,
        "feels_like":293.93,
        "temp_min":292.64,
        "temp_max":295.54,
        "pressure":1012,
        "humidity":58,
        "sea_level":1012,
        "grnd_level":1007
    },
    "visibility":10000,
    "wind":{
        "speed":4.63,
        "deg":250
    },
    "clouds":{
        "all":99
    },
    "dt":1720961310,
    "sys":{
        "type":2,
        "id":2075535,
        "country":"GB",
        "sunrise":1720929599,
        "sunset":1720987943
    },
    "timezone":3600,
    "id":2643743,
    "name":"London",
    "cod":200
}

let {weather} = {...forecast}
console.log(weather)
console.log(forecast.main.temp)

/**
 * Returns the unix time of the forecasted area
 * 
 * @param {Object} forecastObject 
 * @returns Local unix time at the forecasted area .
 */
function getLocalUnixTime(forecastObject) {
    return forecastObject.dt + forecast.timezone
}

console.log(getLocalUnixTime(forecast)*1000)

console.log(new Date(getLocalUnixTime(forecast)*1000).toUTCString())

function showDate(unixTimestampMilli) {
    const timestamp = new Date(unixTimestampMilli)
    const month = timestamp.getUTCMonth()
    const day = timestamp.getUTCDate()
    const hour = timestamp.getUTCHours()
    const mins = timestamp.getUTCMinutes()
    let dateStr = `${day}/${month} - ${hour}:${mins}`

    // TODO: Add to HTML
    console.log(dateStr)
}

showDate(getLocalUnixTime(forecast)*1000)

function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];    
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

console.log(forecast.wind.deg + ": " + getWindDirection(forecast.wind.deg))

console.log(getWindDirection(85))