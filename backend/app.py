import os
from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime
import requests
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()  # Carga las variables de entorno desde el archivo .env

app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app)

API_KEY = os.getenv('OPENWEATHER_API_KEY')
API_URL = 'http://api.openweathermap.org/data/2.5/forecast'

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

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/weather', methods=['POST'])
def get_weather():
    data = request.json
    weather_data = None

    if 'city' in data:
        city = data['city']
        response = requests.get(API_URL, params={
            'q': city,
            'appid': API_KEY,
            'units': 'metric',
            'lang': 'es'
        })
    elif 'latitude' in data and 'longitude' in data:
        latitude = data['latitude']
        longitude = data['longitude']
        response = requests.get(API_URL, params={
            'lat': latitude,
            'lon': longitude,
            'appid': API_KEY,
            'units': 'metric',
            'lang': 'es'
        })

    if response.status_code == 200:
        weather_data = response.json()
        forecast_data = []
        processed_dates = set()

        for item in weather_data['list']:
            forecast_date = datetime.strptime(item['dt_txt'], '%Y-%m-%d %H:%M:%S').date()
            if forecast_date not in processed_dates and len(forecast_data) < 3:
                forecast = {
                    'date': item['dt_txt'],
                    'min_temp': item['main']['temp_min'],
                    'max_temp': item['main']['temp_max'],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon']
                }
                forecast_data.append(forecast)
                processed_dates.add(forecast_date)

        return jsonify({'city': weather_data['city'], 'forecast': forecast_data})
    else:
        return jsonify({'error': 'No se pudo obtener los datos del clima.'}), 400

if __name__ == '__main__':
    app.run(debug=True)
