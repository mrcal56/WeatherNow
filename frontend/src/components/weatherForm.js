import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const WeatherForm = ({ getWeather }) => {
  const [city, setCity] = useState('');
  const [locationFetched, setLocationFetched] = useState(false);

  useEffect(() => {
    if (!locationFetched && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        getWeather({ latitude, longitude });
        setLocationFetched(true);
      });
    }
  }, [locationFetched, getWeather]);

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeather({ city });
    setCity('');
  };

  return (
    <form onSubmit={handleSubmit} className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />
      <div className="input-group-append">
        <button className="btn btn-primary" type="submit">
          <FaSearch />
        </button>
      </div>
    </form>
  );
};

export default WeatherForm;
