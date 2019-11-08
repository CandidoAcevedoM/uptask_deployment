const express = require('express');
const routes = express.Router();
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuarioController = require('../controllers/usuarioController');
const authController = require('../controllers/authController');

const {body} = require('express-validator/check');

module.exports = function() {

    //Proyectos
    routes.get('/', 
        authController.usuarioAutenticado,
        proyectosController.proyectosHome);
    routes.get('/nuevo-proyecto',
    authController.usuarioAutenticado,
        proyectosController.formularioProyecto);
    routes.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    ); 
    routes.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.proyectosPorUrl);
    routes.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar);
    routes.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );
    routes.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto); 

    //Tareas
    routes.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea);

    //actualizar Tareas
    routes.patch('/tareas/:id' , 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea);
    //elimnar tareas
    routes.delete('/tareas/:id' ,
        authController.usuarioAutenticado,
        tareasController.eliminarTarea);

    //Usuarios
    routes.get('/crear-cuenta', usuarioController.formCrearUsuario);
    routes.post('/crear-cuenta', usuarioController.crearCuenta);
    routes.get('/iniciar-sesion', usuarioController.formIniciarSesion);
    routes.post('/iniciar-sesion', authController.autenticarUsuario);
    routes.get('/cerrar-sesion', authController.cerrarSesion);
    routes.get('/restablecer-contrasena', usuarioController.formRestablecerPassword);
    routes.post('/restablecer-contrasena', authController.enviarToken);
    routes.get('/restablecer-contrasena/:token', authController.validarToken);
    routes.post('/restablecer-contrasena/:token', authController.actualizarPassword);
    routes.get('/confirmar-usuario/:email', usuarioController.confirmarCuenta);


    return routes;
}