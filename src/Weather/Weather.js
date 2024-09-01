import React, { useEffect, useState } from 'react'
import './Weather.css'
import { setSelectionRange } from '@testing-library/user-event/dist/utils'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//Images
// import searchIcon from '.search.png';
// import sunIcon from './Weather/Images/sun.gif';
// import cloudIcon from './Weather/Images/cloudy.gif';
// import humidityIcon from './Weather/Images/humidity.gif';
// import stormIcon from './Weather/Images/storm.gif';
// import weatherIcon from './Weather/Images.gif';
// import snowIcon from './Weather/Images/snow.gif';
// import windIcon from './Weather/Images/wind.gif';

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  log,
  humidity,
  wind,
}) => {
  const [currenTime, setCurrentTime] = useState(new Date())

  const formatHour = (hour) => {
    return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  }

  // const formatDate = (date) => {
  //   return date.toLocalDateString ();
  // }
  
  const formatTimeWithLeadingZero = (num) => {
    return num < 10 ? `0${num}` : num;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div className="image">
        <img className="sun" src={icon} alt="Image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">LATITUDE</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">LOGTITUDE</span>
          <span>{log}</span>
        </div>
      </div>

      <div className="data-container">
        <div className="element">
          <img src={'humidity.gif'} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity} %</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element1">
          <div className='ind'>IND TIME</div>
          <div className="time">{formatTimeWithLeadingZero(formatHour(currenTime.getHours()))}  : { formatTimeWithLeadingZero(currenTime.getMinutes())} : { formatTimeWithLeadingZero(currenTime.getSeconds())}  {currenTime.getHours()>= 12 ?"PM": "AM"}
          </div>
          <div className="date">{formatTimeWithLeadingZero(currenTime.getDate())+"/"+formatTimeWithLeadingZero(currenTime.getMonth()) +"/"+formatTimeWithLeadingZero(currenTime.getFullYear())}</div>
        </div>
        <div className="element">
          <img src={'wind.gif'} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind} km/hr</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
}

const Weather = () => {
  let api_key = 'd69ce7886d1a016df3dcab6bc3667072'
  const [text, setText] = useState('')
  const [icon, setIcon] = useState('clear.gif')
  const [temp, setTemp] = useState(0)
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [lat, setLat] = useState(0)
  const [log, setLog] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [wind, setWind] = useState(0)
  const [loading, setLoading] = useState(false)
  const [cityNotFound, setCityNotFound] = useState(false)

  const handleCity = (e) => {
    setText(e.target.value)
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search()
    }
  }

  const weatherIconMap = {
    '01d': 'sun.gif',
    '01n': 'sun.gif',
    '02d': 'cloudy.gif',
    '02n': 'cloudy.gif',
    '03d': 'sun.gif',
    '03n': 'drizzle.gif',
    '04d': 'sun.gif',
    '04n': 'snow.gif',
    '09d': 'rain.gif',
    '09n': 'rain.gif',
    '10d': 'cloudy.gif',
    '10n': 'rain.gif',
    '13d': 'snow.gif',
    '13n': 'snow.gif',
    '50d': 'sun.gif',
    '50n': 'night.gif',
  }

  const search = async () => {
    setLoading(true)
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`

    try {
      let res = await fetch(url)
      let data = await res.json()
      if (data.cod === '404') {
        console.error('City not found!')
        toast.error('City not found!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
        setCityNotFound(true)
        setLoading(false)
        return
      }
      setTemp(Math.floor(data.main.temp))
      setCity(data.name)
      setCountry(data.sys.country)
      setLat(data.coord.lat)
      setLog(data.coord.lon)
      setHumidity(data.main.humidity)
      setWind(data.wind.speed)

      const weatherIconcode = data.weather[0].icon
      console.log(data.weather[0].icon)
      setIcon(weatherIconMap[weatherIconcode] || 'clear.gif')
      setCityNotFound(false)
    } catch (error) {
      console.error('An error occured: ', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(function () {
    search()
  }, [])

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Enter the city"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className="searchImage" onClick={() => search()}>
            <img src="search.png" alt="search" />
          </div>
        </div>
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          log={log}
          humidity={humidity}
          wind={wind}
        />
      </div>

      <p className="copyright">
        Designed By <a href="https://github.com/Guhan11">Guhan</a>
      </p>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

export default Weather
