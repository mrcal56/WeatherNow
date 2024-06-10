import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Form, Button } from 'react-bootstrap';

const WeatherForm = ({ setLocation }) => {
  const [city, setCity] = useState('');
  const [locationFetched, setLocationFetched] = useState(false);

  useEffect(() => {
    if (!locationFetched && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setLocationFetched(true);
      });
    }
  }, [locationFetched, setLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocation({ city });
    setCity('');
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex">
      <Form.Control
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
        className="me-2"
      />
      <Button type="submit" variant="primary">
        <FaSearch />
      </Button>
    </Form>
  );
};

export default WeatherForm;
