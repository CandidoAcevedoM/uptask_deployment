const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handles/email');

exports.formCrearUsuario = (req, res) => {
    res.render('crearUsuario', {
        nombrePaginas: 'Crear Cuenta'
    });
}

exports.crearCuenta = async  (req, res) => {
    //Obtener los datos
    //console.log(req.body);
    const {email, password} = req.body;

    try {
      //Guarar los datos
        await Usuarios.create({
            email,
            password
        });

        //Crear una Url de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar-usuario/${email}`;

        //Crear el objecto de Usuarios
        const usuario = {
            email
        }

        //Enviar Email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        //Redirigir al Usuario
        req.flash('correcto', 'Enviamos un correo para Confirmar tu Cuenta');

        res.redirect('/iniciar-sesion'); 
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message))
        res.render('crearUsuario', {
            mensajes: req.flash(),
            nombrePaginas: 'Crear Cuenta',
            email,
            password
        }); 
    }    
    
}

exports.formIniciarSesion = (req, res) => {
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion', {
      nombrePaginas: 'Iniciar Sesion',
      error
    });
}

exports.formRestablecerPassword = (req, res) => {
    res.render('restablecer', {
        nombrePaginas: 'Restablecer Contraseña'
    })
}

//Cambia el estado de la cuenta
exports.confirmarCuenta = async (req, res) => {
    //res.json(req.params.email)
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.email
        }
    });

    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta confirmada');
    res.redirect('/iniciar-sesion');
}
