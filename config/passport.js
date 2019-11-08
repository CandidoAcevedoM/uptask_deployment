const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referecnia al modelo que vamos a utilizar
const Usuarios = require('../models/Usuarios');

//local-strategy login con credenciales propias(usuario y password)
passport.use(
    new LocalStrategy(
        //por default passport espera un usuario y un password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
               const usuario = await Usuarios.findOne({
                   where: {
                       email: email,
                       activo: 1
                   }
               });

               //El usuario existe, password incorrecto
               if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Algo salio mal, verifique su password'
                    });
               }

               return done(null, usuario);
            } catch (error) {
               return done(null, false, {
                   message: 'Esa cuenta no existe'
               });
            }
        }
    )
    
);

//serilizar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

//Deserializarel usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

//Exportar
module.exports = passport;