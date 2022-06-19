const inquirer = require('inquirer');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            },
        ]
    }
];


const inquirerMenu = async () => {
    console.clear();
    console.log('------------------------------'.green);
    console.log('    Seleccione una opción'.green);
    console.log('------------------------------\n'.green);

    const { opcion } = await inquirer.prompt(preguntas);

    //console.log(preguntas);
    return opcion;
}

//Tarea
const pausa = async () => {
    const question = [
        {
            type: 'input',
            name: 'pausa',
            message: `Presione ${'ENTER'.green} para continuar`
        }
    ];

    console.log('\n');
    await inquirer.prompt(question);
}

const leerInput = async (message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if (value.length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);

    return desc;
}

const listarLugares = async (lugares = []) => {

    const choices = lugares.map((lugar, i) => { //opciones console
        const iAux = `${(i + 1) + '.'}`.green;
        return {
            value: lugar.id,
            name: `${iAux} ${lugar.nombre}`
        };
    });

    choices.unshift({
        value: '0',
        name: `${'0.'.green} Cancelar`
    });


    const preguntas = [{
        type: 'list',
        name: 'id',
        message: 'Seleccione lugar:',
        choices
    }];

    const { id } = await inquirer.prompt(preguntas);
    return id;
    // console.log(choices); //Obtenemos los datos para poder seleccionarlas
}

const confirmar = async (message) => {
    const question = [ //confirm regresa un valor boolean
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];
    const { ok } = await inquirer.prompt(question);
    return ok;
}

const mostrarListadoCheckList = async (tareas = []) => {

    const choices = tareas.map((tarea, i) => {
        const iAux = `${(i + 1) + '.'}`.green;
        return {
            value: tarea.id,
            name: `${iAux} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false
        };
    });

    const pregunta = [{
        type: 'checkbox', //Devuelve un arreglo con todos los objetos a eliminar
        name: 'ids',
        message: 'Selecciones',
        choices
    }];

    const { ids } = await inquirer.prompt(pregunta);
    return ids;
    // console.log(choices); //Obtenemos los datos para poder seleccionarlas
}


module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoCheckList
}