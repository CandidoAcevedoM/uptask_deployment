const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./config/db');
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
const helpers = require('./helpers');
const flash = require('connect-flash');
const cookie = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
require('dotenv').config({path: 'varieable.env'});

db.sync()
    .then(() => console.log('conectado al servidor'))
    .catch(error => console.log(error))

//crear app con express
const app = express();

//Cargar archivos estaticos
app.use(express.static('public'));

//Habilitar pug
app.set('view engine', 'pug');

//Agregar carpeta
app.set('Views', path.join(__dirname, 'views'));

//Habilitar el bodyParser para leer los datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

//Agregando flash alert
app.use(flash());

app.use(cookie());

//sessiones nos permiten navegar sin vovlers autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Agregando los helpers a la aplicacion
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

app.use('/', routes());

//servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando');
});

require('./handles/email');