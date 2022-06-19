const fs = require('fs');
const axios = require("axios");


class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        //TODO: leer DB si existe
        this.leerDB();
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    // Metodos
    async ciudad(lugar = '') {
        try {
            //peticion http
            // instancia de axios
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            //console.log(resp.data.features); // resp.data

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                log: lugar.center[0],
                lat: lugar.center[1]
            })); // => ({}) retornamos un objeto de forma implicita

        } catch (error) {
            console.log(error.message);
            return [];
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    //Obtener clima 
    async climaLugar(lat, lon) {

        try {
            // instancia de axios
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat, lon }
            });

            // response http
            const resp = await instance.get();

            const { data } = resp;
            const { weather, main } = data; // evitamos el resp.data.<param>.<param>

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            console.log(error.message);
            return [];
        }
    }

    agregarHistorial(lugar = '') {
        if (this.historial.includes(lugar.toLowerCase())) return; //Verificamos que no se repitan los datos

        this.historial = this.historial.splice(0, 5); // Solo listamos los ultimos 5 lugares que buscamos sus climas

        this.historial.unshift(lugar.toLowerCase()); // ingresaremos en el principio

        // Grabar DB .json
        this.guardarDB();
    }

    guardarDB() {
        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    // Tarea
    // ? esto no tiene mucho sentido -> el API retorna datos capitalizados
    get historialCapitalizado() {
        // Capitalizar palabras
        return this.historial.map(lugar => {
            let palabras = lugar.split(' '); // Cortamos los espacio de cada registro y generamos un arreglo de 3 palabras
            palabras = palabras.map(palabra => palabra[0].toUpperCase() + palabra.substring(1)); // Capitalizamos la primera letra de cada palabra y lo concatenamos con el restante
            return palabras.join(' '); // Se unen las palabras del arreglo generado en let palabras -> por un espacio
        });
    }

    // Tarea
    leerDB() {
        if (!fs.existsSync(this.dbPath)) return null;

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });

        const data = JSON.parse(info);

        this.historial = data.historial; // Asignamos la data de la bd al array historial
    }

}



module.exports = Busquedas;