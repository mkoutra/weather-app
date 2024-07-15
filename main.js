$(function() {
    $('#searchBtn').on('click', function() {
        getWeather($('#searchInput').val())
    })
})

function getWeather(cityName) {
    let xhr = new XMLHttpRequest()
    let WEATHER_API_KEY

    xhr.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${WEATHER_API_KEY}`)
    xhr.timeout = 5000
    xhr.ontimeout = (e) => onApiError(e)
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                handleForecast(JSON.parse(xhr.responseText))
            } else {
                onApiError()
            }
        }
    }

    xhr.send()
}

function handleForecast(forecastObject) {
    if (forecastObject.cod !== 200) {
        onApiError()
        return
    }
    let transformedForecast = transformResponse(forecastObject)
    buildWeather(transformedForecast)
}

/****************************************************************************/
/****************************** Transformers ********************************/
/****************************************************************************/

function transformResponse(forecastObject) {
    if (!forecastObject) return
    transformDescription(forecastObject)
    transformVisibility(forecastObject)
    transformWind(forecastObject)
    transformRain(forecastObject)
    return forecastObject
}

/**
 * Transform description of the forecast
 * object to Capitalize Each Word.
 * 
 * @param {Object} forecastObject
 *      The input forecast object.
 * @returns {Object}
 *      The transformed forecast object.
 */
function transformDescription(forecastObject) {
    if (!forecastObject ||
        !forecastObject.weather ||
        !forecastObject.weather[0] ||
        !forecastObject.weather[0].description) {
            return forecastObject;
    }
    forecastObject.weather[0].description = _.startCase(forecastObject.weather[0].description);
    console.log(forecastObject.weather[0].description)
    return forecastObject;
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
 * Transforms rain in the forecast object.
 * 
 * @param {Object} forecastObject
 *      The input forecast object.
 * @returns
 *      The transformed object
 */
function transformRain(forecastObject) {
    if (!forecastObject) return
    if (!forecastObject.rain) {
        forecastObject['rain'] = '-'
    } else {
        forecastObject['rain'] = forecastObject.rain['1h'] + " mm"
    }
    return forecastObject
}

/****************************************************************************/
/******************************** Helpers ***********************************/
/****************************************************************************/

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
    if (!forecastObject.hasOwnProperty('dt') ||
        !forecastObject.hasOwnProperty('timezone')) {
            return
    }
    return forecastObject.dt + forecastObject.timezone
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

/****************************************************************************/
/******************************* Rendering **********************************/
/****************************************************************************/

function buildWeather(transformedForecast) {
    cleanSearch()
    showMainWeather(transformedForecast)
    showDetails(transformedForecast)
}

function cleanSearch() {
    $('#searchInput').attr('placeholder', '')
}

function showMainWeather(transformedForecast) {
    showIcon(transformedForecast)
    showLocation(transformedForecast)
    showDate(transformedForecast)
    showDescription(transformedForecast)
    showTemperature(transformedForecast)
}

function showDetails (transformedForecast) {
    if (!transformedForecast) return
    showWind(transformedForecast)
    $('#rain').text(transformedForecast.rain)
    $('#humidity').text(transformedForecast.main.humidity + ' %')
    $('#visibility').text(transformedForecast.visibility + ' km')
    $('#pressure').text(transformedForecast.main.pressure + ' hPa')
}

function showIcon(transformedForecast) {
    let iconId = transformedForecast.weather[0].icon
    $('#icon').attr('src', `https://openweathermap.org/img/wn/${iconId}@2x.png`)
}

function showLocation(transformedForecast) {
    $('#name').text(transformedForecast.name)
    $('#country').text(transformedForecast.sys.country)
}

function showDate(forecastObject) {
    if (!forecastObject) return
    const localUnixTime = getLocalUnixTime(forecastObject)
    const dateStr = unixTimeToString(localUnixTime * 1000)
    $('#dateTime').text(dateStr)
}

function showDescription(transformedForecast) {
    const description = transformedForecast.weather[0].description
    $('#description').text(description)
}

function showTemperature(transformedForecast) {
    showThermometer(transformedForecast)
    $('#temp').text(Math.floor(transformedForecast.main.temp))
}

function showThermometer(transformedForecast) {
    const types = ['', '-low' ,'-half', '-high']
    const temp = transformedForecast.main.temp
    let thermometerName = 'bi-thermometer'
    let index

    if (temp < 0) {
        thermometerName += '-snow'
    } else {
        index = Math.floor(temp / 10) <= 3 ? Math.floor(temp / 10) : 3
        thermometerName += types[index]
    }

    $('#temperature').find('i').removeClass()   // Remove all classes
    $('#temperature').find('i').addClass(`bi ${thermometerName}`)
}

function showWind(transformedForecast) {
    if (!transformedForecast) return
    $('#wind').find('#speed').text(transformedForecast.wind.speed + " Bf")
    $('#wind').find('#deg').text(transformedForecast.wind.deg)
}

function onApiError() {
    console.log('API ERROR')
}