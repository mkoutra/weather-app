$(function() {
    $('#searchBtn').on('click', function() {
        getWeather($('#searchInput').val())
    })
})

function getWeather(cityName) {
    let xhr = new XMLHttpRequest()
    let WEATHER_API_KEY

    xhr.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${WEATHER_API_KEY}`)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {

            }
        }
    }
}

/**
 * Returns the unix time of the forecasted area.
 * 
 * @param {Object} forecastObject
 *          The object containing the forecast
 *          given by the open Weather API.
 * @returns Local unix time at the forecasted area .
 */
function getLocalUnixTime(forecastObject) {
    return forecastObject.dt + forecast.timezone
}

/**
 * Adds to UI the date of the given
 * a unix time in milliseconds.
 * 
 * @param {numeric} unixTimestampMilli Unix time in milliseconds
 */
function showDate(unixTimestampMilli) {
    const timestamp = new Date(unixTimestampMilli)
    const month = timestamp.getUTCMonth()
    const day = timestamp.getUTCDate()
    const hour = timestamp.getUTCHours()
    const mins = timestamp.getUTCMinutes()
    let dateStr = `${day}/${month} - ${hour}:${mins}`

    // TODO: Add to HTML
    // console.log(dateStr)
}

/**
 * Returns the wind direction given
 * wind direction in degrees.
 * 
 * @param {numeric} degrees 
 * @returns A string of the wind direction
 */
function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];    
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}