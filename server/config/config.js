//=============================
//Puerto
//=============================
process.env.PORT = process.env.PORT || 3000;

//=============================
//Entorno
//=============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=============================
//Vencimiento del Token
//=============================
//60
//60
//24
//30
process.env.CAUDICIDAD_TOKEN = 60 * 60 * 24 * 30;
//=============================
//SEED de autenticacion
//=============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
//=============================
//Base de datos
//=============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    // urlDB = 'mongodb://cafe-user:123456abc@ds121176.mlab.com:21176/cafe';
    urlDB = process.env.MONGO_URI //variable de entorno creada en heroku
}

process.env.URLDB = urlDB;