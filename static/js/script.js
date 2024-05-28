
//funcion para obtener la ubicacion del usuario
function getLocation(){
    //verificar si la geolocalizacion esta soportada por el navegador
    if (navigator.geolocation){
        //obtener la posicion actual del usuario
        navigator.geolocation.getCurrentPosition(showPosition);
    } else{
        //MOSTRAR ALERTA SI LA GEOLOCALIZACION NO ES SOPORTADO
        alert("Geolocalizacion no es soportado para este navegador")
    }
}

//FUNCION PARA MANEJAR LA POSICION OBTENIDA
function showPosition(position){
    //ASIGNAR LAS COORDENADAS OBTENIDAS A LOS CAMPOS OCULTOS DEL FORMULARIO
    document.getElementById('latitude').value = position.coords.latitude;
    document.getElementById('longitude').value = position.coords.longitude;
    //ENVIAR EL FORMULARIO AUTOMATICAMENTE
    document.getElementById('geoForm').submit();
}