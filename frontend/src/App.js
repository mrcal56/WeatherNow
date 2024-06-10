import React, { useState, useEffect } from 'react';
import WeatherForm from './components/weatherForm'; // Importa el componente WeatherForm
import WeatherDisplay from './components/weatherDisplay'; // Importa el componente WeatherDisplay
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap
import { Button } from 'react-bootstrap';

function App() {
  const [weatherData, setWeatherData] = useState(null); // Estado para almacenar los datos del clima
  const [location, setLocation] = useState(null); // Estado para almacenar la ubicación del usuario

  // Función para obtener el clima
  const getWeather = async (location) => {
    try {
      // Realiza una solicitud POST a la API del backend
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location),
      });

      // Verifica si la respuesta es exitosa
      if (response.ok) {
        // Parsear la respuesta JSON
        const data = await response.json();
        // Actualizar el estado con los datos del clima
        setWeatherData(data);
      } else {
        // Si hay un error, actualizar el estado con un mensaje de error
        setWeatherData({ error: 'City not found or incomplete input' });
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Si hay un error en la solicitud, actualizar el estado con un mensaje de error
      setWeatherData({ error: 'Error fetching weather data' });
    }
  };

  // Usar useEffect para obtener el clima cuando la ubicación cambia
  useEffect(() => {
    if (location) {
      getWeather(location); // Llama a getWeather con la nueva ubicación
    }
  }, [location]);

  // Función para obtener la ubicación actual
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude }); // Actualiza la ubicación en el estado del componente App
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="container mt-5">
      <Button onClick={handleGetCurrentLocation} variant="primary" className="get-location-btn">
        Obtener Clima Por Ubicación Actual
      </Button>
      <h1 className="text-center mb-4">Weather App</h1>
      {/* Renderiza el formulario para ingresar la ciudad */}
      <WeatherForm setLocation={setLocation} />
      {/* Renderiza la información del clima si está disponible */}
      {weatherData && <WeatherDisplay weatherData={weatherData} />}
    </div>
  );
}

export default App; // Exporta el componente App para ser utilizado en otros archivos
