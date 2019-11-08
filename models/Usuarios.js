const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Coloca un Email Valido'
            },
            notEmpty:{
                args: true,
                msg: 'No puede ir vacio el Email'
            }
        },
        unique: {
            args: true,
            msg: 'Por favor colocar otro Email'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty:{
                msg: 'No puede ir vacio el Password'
            }
        }
    },    
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token:{
        type: Sequelize.STRING
    }, 
    expiracion:{
        type: Sequelize.DATE
    }
}, {
    hooks: {
        beforeCreate(usuarios){
            usuarios.password = bcrypt.hashSync(usuarios.password, bcrypt.genSaltSync(10));
        }
    }
});

//Metodos personalizados
Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;