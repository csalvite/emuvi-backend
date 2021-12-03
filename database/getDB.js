require('dotenv').config

const mysql = require('mysql2/promise');

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

let pool;

//Funcion que devuelve una conexion a la base de datos
const getDB = async () => {
    //si no hay...
    if (!pool) {
        //Creamos un grupo de conexiones
        pool = mysql.createPool({
            connectionLimit: 10,
            host: MYSQL_HOST
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
            database: MYSQL_DATABASE,
            timezone: 'Z',
        });
    }
    
    //Ejecutamos el metodo "getConnection" y devolvemos una coexion libre
    
    return await pool.getConnection();
};

module.export = getDB;
