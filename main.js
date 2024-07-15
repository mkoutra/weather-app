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
                handleForecast(JSON.parse(xhr.responseText))
            } else {
                onApiError()
            }
        }
    }
}

function handleForecast(forecastObject) {

}

/**
 * Transform visibility in the given
 * forecast object to kilometers.
 * 
 * @param {Object} forecastObject
 *      The input forecast object.
 * @returns {Object}
 *      The transformed forecast object.
 */
function transformVisibility(forecastObject) {
    if (!forecastObject)
        return;

    if (!forecastObject.hasOwnProperty('visibility')) {
        forecastObject['visibility'] = "-"
    } else {
        forecastObject["visibility"] /= 1000
    }
    return forecastObject
}

/**
 * Transforms the units and wind direction
 * in the given forecast object and returns it.
 *
 * @param {Object} forecastObject
 *      The input forecast object.
 * @returns {Object}
 *      The transformed object.
 */
function transformWind(forecastObject) {
    if (!forecastObject) return;

    let { wind} = {...forecastObject}
    if (!wind) {
        wind = {'speed':'-', 'deg':'-'}
    } else {
        wind.speed = wind.speed ? getBeaufortFromMS(wind.speed) : '-'
        wind.deg = wind.deg ? getWindDirection(wind.deg) : '-'
    }
    forecastObject.wind = wind
    return forecastObject
}

/**
 * Transforms and returns units of
 * wind speed from m/s to Beaufort.
 * 
 * @param {numeric} speedMetric
 *      Wind speed in m/s.
 * @returns {number|string}
 *      The rounded Beaufort value, otherwise '-'.
 */
function getBeaufortFromMS(speedMetric) {
    if (!speedMetric) return "-"
    return Math.round(Math.pow((speedMetric / 0.836), 2./3.))
}

/**
 * Returns the local Unix time of the forecasted area.
 *  
 * @param {Object} forecastObject
 *      The object containing the forecast
 *      given by the Open Weather API.
 * @returns
 *      Local Unix time at the forecasted area.
 */
function getLocalUnixTime(forecastObject) {
    if (!forecastObject.hasOwnProperty('dt') || !forecastObject.hasOwnProperty('timezone'))
        return
    return forecastObject.dt + forecast.timezone
}

/**
 * Converts Unix time in milliseconds
 * to a formatted date string.
 * 
 * @param {numeric} unixTimestampMilli
 *      Unix time in milliseconds
 * @returns {string}
 *      The formatted date string.
 */
function unixTimeToString(unixTimestampMilli) {
    if (!unixTimestampMilli) return "-"

    const timestamp = new Date(unixTimestampMilli)
    const month = timestamp.getUTCMonth()
    const day = timestamp.getUTCDate()
    const hour = timestamp.getUTCHours()
    const mins = timestamp.getUTCMinutes()

    return `${day}/${month} - ${hour}:${mins}`
}

/**
 * Renders a date string to the UI.
 * 
 * @param {string} dateStr
 *      A string containing the date to be rendered.
 */
function showDate(dateStr) {
    if (dateStr) return
    $('#dateTime').html(dateStr)
}

/**
 * Returns the wind direction name 
 * given the wind direction in degrees.
 * 
 * @param {numeric} degrees
 *      Wind direction in degrees.
 * @returns {string}
 *      A string of the wind direction.
 */
function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];    
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}