require('dotenv').config();
require('colors');
const axios = require('axios'); //axios para hacer la conexion http - endpoints -> endpoint :: url
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async () => {

    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();
        //console.log({ opt });
        switch (opt) {
            case 1:
                // Mostrar mensaje
                const ciudad = await leerInput('Ciudad: ');

                // Buscar los lugares
                const lugares = await busquedas.ciudad(ciudad);

                // console.log(lugares);

                if (lugares.length === 0) {
                    console.log(`No se encontraron ciudades con la entrada: ${ciudad} => Volviendo al menú principal`.red);
                    setTimeout(() => {
                        main();
                    }, 3000);
                    return;
                }

                // Seleccionar el lugar
                const id = await listarLugares(lugares); // Para poder listar con opcion - Obtengo el id de la ciudad seleccionada
                if (id === '0') continue;
                const lugarSel = lugares.find(lugar => lugar.id === id); //Obtener datos de la ciudad segun su id

                //Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);

                // Clima
                const { log: lon, lat } = lugarSel;
                const clima = await busquedas.climaLugar(lat, lon);

                // Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', `${lugarSel.nombre}`.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Log:', lugarSel.log);
                console.log('Temperatura: ', clima.temp);
                console.log('Mínima: ', `${clima.min}`.blue);
                console.log('Máxima: ', `${clima.max}`.red);
                console.log('Clima: ', `${clima.desc}`.toUpperCase().green);
                break;
            case 2: // Listar Historial
                // busquedas.historialCapitalizado.forEach((lugar, i) => {
                //     const iAux = `${i + 1}.`.green;
                //     console.log(`${iAux} ${lugar}`);
                // });

                // console.log(busquedas.historialCapitalizado);

                const dataStructure = busquedas.historialCapitalizado.map((lugar, i) => ({ nombre: lugar, id: i }));


                // console.log(dataStructure);


                // Listar Historial
                const idSeleccionado = await listarLugares(dataStructure);
                if (idSeleccionado === '0') continue;

                const lugarHistorial = busquedas.historialCapitalizado[idSeleccionado];

                if (!lugarHistorial) {
                    console.log('Lugar no encontrado en el historial.');
                    continue;
                }

                // Clima directamente para el lugar del historial
                const cli = await busquedas.climaLugarPorNombre('Lima, Provincia de Lima, Perú');

                // Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad desde el historial\n'.green);
                console.log('Ciudad:', `${lugarHistorial}`.green);
                console.log('Temperatura: ', cli.temp);
                console.log('Mínima: ', `${cli.min}`.blue);
                console.log('Máxima: ', `${cli.max}`.red);
                console.log('Clima: ', `${cli.desc}`.toUpperCase().green);
                break;

        }

        (opt !== 0) ? await pausa() : null; //Para que muestre el mensaje de ENTER con todas las opciones
    } while (opt !== 0);
}

main();

/**
 * MapBox register - pasarela de pago:
 * cardnumber: 4242424242424242
 * expiry: fecha random despues de la fecha de la fecha de registro :: MMYYYY
 * CVC : 3 digitos random
 * postalCode: random
 * revisa el correo no importa si te lanza error la pasarela
*/

//Clima :: openweather -> acount

//Puede ser director npm start || npm run start
//cuando se utiliza un comando que no es start se usa npm run <comando> :: npm run dev, es decir no es script configurado por nosotros en package.json
