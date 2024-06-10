import React from 'react';
import { FaSun, FaCloud, FaSnowflake, FaSmog, FaBolt, FaCloudSun, FaCloudShowersHeavy } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const WeatherDisplay = ({ weatherData }) => {
  if (weatherData.error) {
    return <p className="text-danger">{weatherData.error}</p>;
  }

  const getWeatherIcon = (description) => {
    const iconStyle = { fontSize: '3rem' };

    switch (description.toLowerCase()) {
      case 'clear sky':
        return <FaSun style={{ ...iconStyle, color: '#FFD700' }} />;
      case 'few clouds':
        return <FaCloudSun style={{ ...iconStyle, color: '#B0C4DE' }} />;
      case 'scattered clouds':
      case 'broken clouds':
      case 'nubes dispersas':
        return <FaCloud style={{ ...iconStyle, color: '#B0C4DE' }} />;
      case 'lluvia ligera':
      case 'rain':
      case 'shower rain':
        return <FaCloudShowersHeavy style={{ ...iconStyle, color: '#1E90FF' }} />;
      case 'thunderstorm':
        return <FaBolt style={{ ...iconStyle, color: '#FFA500' }} />;
      case 'snow':
        return <FaSnowflake style={{ ...iconStyle, color: '#00BFFF' }} />;
      case 'mist':
        return <FaSmog style={{ ...iconStyle, color: '#696969' }} />;
      case 'nubes':
        return <FaCloud style={{ ...iconStyle, color: '#B0C4DE' }} />;
      default:
        return <FaCloud style={iconStyle} />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="card mb-4">
        <div className="card-body text-center">
          <h2 className="card-title">Weather in {weatherData.city.name}</h2>
          <p className="card-text">Temperature: {weatherData.forecast[0].min_temp} - {weatherData.forecast[0].max_temp} °C</p>
          <p className="card-text">Condition: {weatherData.forecast[0].description}</p>
          <div className="display-1">{getWeatherIcon(weatherData.forecast[0].description)}</div>
        </div>
      </div>
      <h2 className="text-center mb-3">Forecast for the next 3 days</h2>
      <div className="row">
        {weatherData.forecast.map((forecast, index) => (
          <div className="col-md-4" key={index}>
            <div className="card mb-3">
              <div className="card-body text-center">
                <h5 className="card-title">{formatDate(forecast.date)}</h5>
                <p className="card-text">Min Temp: {forecast.min_temp} °C</p>
                <p className="card-text">Max Temp: {forecast.max_temp} °C</p>
                <p className="card-text">Condition: {forecast.description}</p>
                <div className="display-1">{getWeatherIcon(forecast.description)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDisplay;
