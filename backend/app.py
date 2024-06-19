from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime
import requests
from flask_cors import CORS

# Crear una instancia de Flask, especificando el directorio de construcción como el directorio estático
app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app)

API_KEY = '5de18af6a9f6045c8eb647ddb6881687'
API_URL = 'http://api.openweathermap.org/data/2.5/forecast'

# Ruta para servir el archivo HTML principal de React
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# Ruta para servir otros archivos estáticos
@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

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



