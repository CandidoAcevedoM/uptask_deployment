const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const cripto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handles/email');

//Funcion para saber si la autenticacion fue exitosa
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos so obligatorios'
});

//Funcion ppara saber si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    //si el usuario esta autenticado sigue
    if(req.isAuthenticated()){
        return next();
    }

    //SIno lo devolvemos a inicisar sesion
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}

//genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
    //Verificar el usuario
    const {email} = req.body
    const usuario =  await Usuarios.findOne({
        where: {
            email
        }
    });

    //Si no hay usuarios
    if(!usuario){
        req.flash('error', 'No existe esa Cuenta');
        res.redirect('/restablecer-contrasena');
    }

    usuario.token = cripto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() +  3600000

    await usuario.save();

    const resetUrl = `http://${req.headers.host}/restablecer-contrasena/${usuario.token}`;

    //enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Passwword Reset',
        resetUrl,
        archivo: 'restablecer-password'
    });

    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

    //console.log(resetUrl);
}

exports.validarToken = async (req, res) => {
    //res.json(req.params.token)
    
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    console.log(usuario);

    //Si no encuentra el usuario
    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/restablecer-contrasena');
    } 
    
    
    res.render('resetPassword', {
        nombrePaginas: 'Restablecer Contraseña'
    }) 
    
}

exports.actualizarPassword = async (req, res) => {
    //console.log(req.params.token);

    //Verifica token valido y la fecha de verificacion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()                
            }
        }
    });

    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/restablecer-contrasena');
    }

    //Encriptar la password nueva
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    
    await usuario.save();

    req.flash('correcto', 'Tu Contraseñase se ha Restablecido Corractamente')
    res.redirect('/iniciar-sesion');

   // console.log(usuario);
}

