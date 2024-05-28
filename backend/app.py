# Importar los módulos necesarios
from flask import Flask, request, jsonify, render_template
from datetime import datetime
import requests
from flask_cors import CORS  # Este módulo permite solicitudes entre el frontend y el backend

# Crear una instancia de Flask
app = Flask(__name__, template_folder='templates')  # Asegúrate de tener un directorio 'templates'
CORS(app)  # Permitir solicitudes desde el frontend

# Clave API (reemplaza con tu propia clave)
API_KEY = '5de18af6a9f6045c8eb647ddb6881687'
# URL base de la API de OpenWeatherMap
API_URL = 'http://api.openweathermap.org/data/2.5/forecast'

# Función para mapear los códigos de icono a las clases de icono de Weather Icons
def weather_icon(icon_code):
    icon_mapping = {
        "01d": "wi-day-sunny",
        "01n": "wi-night-clear",
        "02d": "wi-day-cloudy",
        "02n": "wi-night-alt-cloudy",
        "03d": "wi-cloud",
        "03n": "wi-cloud",
        "04d": "wi-cloudy",
        "04n": "wi-cloudy",
        "09d": "wi-showers",
        "09n": "wi-showers",
        "10d": "wi-day-rain",
        "10n": "wi-night-alt-rain",
        "11d": "wi-thunderstorm",
        "11n": "wi-thunderstorm",
        "13d": "wi-snow",
        "13n": "wi-snow",
        "50d": "wi-fog",
        "50n": "wi-fog"
    }
    return icon_mapping.get(icon_code, "wi-na")

# Ruta principal para servir la página HTML
@app.route('/', methods=['GET', 'POST'])
def index():
    weather_data = None
    if request.method == 'POST':
        # Manejar la solicitud POST del formulario
        if 'city' in request.form:
            city = request.form['city']
            response = requests.get(API_URL, params={
                'q': city,
                'appid': API_KEY,
                'units': 'metric',
                'lang': 'es'
            })
        elif 'latitude' in request.form and 'longitude' in request.form:
            latitude = request.form['latitude']
            longitude = request.form['longitude']
            response = requests.get(API_URL, params={
                'lat': latitude,
                'lon': longitude,
                'appid': API_KEY,
                'units': 'metric',
                'lang': 'es'
            })

        # Si la solicitud a la API es exitosa (código 200)
        if response.status_code == 200:
            weather_data = response.json()
            forecast_data = []
            processed_dates = set()  # Conjunto para almacenar fechas procesadas

            # Procesar cada entrada del pronóstico
            for item in weather_data['list']:
                forecast_date = datetime.strptime(item['dt_txt'], '%Y-%m-%d %H:%M:%S').date()
                if forecast_date not in processed_dates and len(forecast_data) < 3:
                    # Crear un diccionario con los datos del pronóstico
                    forecast = {
                        'date': item['dt_txt'],
                        'min_temp': item['main']['temp_min'],
                        'max_temp': item['main']['temp_max'],
                        'description': item['weather'][0]['description'],
                        'icon': item['weather'][0]['icon']
                    }
                    # Añadir el pronóstico a la lista
                    forecast_data.append(forecast)
                    # Añadir la fecha al conjunto de fechas procesadas
                    processed_dates.add(forecast_date)

            # Añadir los datos del pronóstico a weather_data
            weather_data['forecast'] = forecast_data

    # Renderizar la plantilla index.html con los datos del clima (si los hay)
    return render_template('index.html', weather_data=weather_data, weather_icon=weather_icon)

# Ruta de la API para obtener el clima (opcional)
@app.route('/api/weather', methods=['POST'])
def get_weather():
    data = request.json  # Obtener los datos JSON enviados en la solicitud
    weather_data = None

    # Verificar si se proporcionó una ciudad
    if 'city' in data:
        city = data['city']
        response = requests.get(API_URL, params={
            'q': city,
            'appid': API_KEY,
            'units': 'metric',
            'lang': 'es'  # Obtener la temperatura en grados Celsius
        })
    # Verificar si se proporcionaron coordenadas geográficas
    elif 'latitude' in data and 'longitude' in data:
        latitude = data['latitude']
        longitude = data['longitude']
        response = requests.get(API_URL, params={
            'lat': latitude,
            'lon': longitude,
            'appid': API_KEY,
            'units': 'metric',  # Obtener la temperatura en grados Celsius
            'lang': 'es'
        })

    # Si la solicitud a la API es exitosa (código 200)
    if response.status_code == 200:
        weather_data = response.json()
        forecast_data = []
        processed_dates = set()  # Conjunto para almacenar fechas procesadas

        # Procesar cada entrada del pronóstico
        for item in weather_data['list']:
            forecast_date = datetime.strptime(item['dt_txt'], '%Y-%m-%d %H:%M:%S').date()
            if forecast_date not in processed_dates and len(forecast_data) < 3:
                # Crear un diccionario con los datos del pronóstico
                forecast = {
                    'date': item['dt_txt'],
                    'min_temp': item['main']['temp_min'],
                    'max_temp': item['main']['temp_max'],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon']
                }
                # Añadir el pronóstico a la lista
                forecast_data.append(forecast)
                # Añadir la fecha al conjunto de fechas procesadas
                processed_dates.add(forecast_date)

        # Devolver los datos del clima en formato JSON
        return jsonify({'city': weather_data['city'], 'forecast': forecast_data})
    else:
        # Si hubo un error, devolver un mensaje de error
        return jsonify({'error': 'No se pudo obtener los datos del clima.'}), 400

# Ejecutar la aplicación en modo de depuración
if __name__ == '__main__':
    app.run(debug=True)
