import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const WeatherDisplay = ({ weatherData }) => {
  if (weatherData.error) {
    return <p className="text-danger">{weatherData.error}</p>;
  }

  return (
    <div>
      <div className="card mb-4">
        <div className="card-body text-center">
          <h2 className="card-title">Weather in {weatherData.city.name}</h2>
          <p className="card-text">Temperature: {weatherData.forecast[0].min_temp} - {weatherData.forecast[0].max_temp} °C</p>
          <p className="card-text">Condition: {weatherData.forecast[0].description}</p>
          <i className={`wi ${weatherData.forecast[0].icon} display-1`}></i>
        </div>
      </div>
      <h2 className="text-center mb-3">Forecast for the next 3 days</h2>
      <div className="row">
        {weatherData.forecast.map((forecast, index) => (
          <div className="col-md-4" key={index}>
            <div className="card mb-3">
              <div className="card-body text-center">
                <h5 className="card-title">{forecast.date}</h5>
                <p className="card-text">Min Temp: {forecast.min_temp} °C</p>
                <p className="card-text">Max Temp: {forecast.max_temp} °C</p>
                <p className="card-text">Condition: {forecast.description}</p>
                <i className={`wi ${forecast.icon} display-1`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDisplay;
