import React, { useState, useEffect } from 'react';
import WeatherForm from './components/weatherForm';
import WeatherDisplay from './components/weatherDisplay';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);

  const getWeather = async (location) => {
    try {
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location),
      });

      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
      } else {
        setWeatherData({ error: 'City not found or incomplete input' });
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData({ error: 'Error fetching weather data' });
    }
  };

  useEffect(() => {
    if (location) {
      getWeather(location);
    }
  }, [location]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Weather Application</h1>
      <WeatherForm setLocation={setLocation} />
      {weatherData && <WeatherDisplay weatherData={weatherData} />}
    </div>
  );
}

export default App;
