const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');


exports.proyectosHome = async (req, res) => {
    console.log(res.locals.usuario.id);

    const usuarioId = res.locals.usuario.id 

    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });

    res.render('index', {
        nombrePaginas : 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async (req, res) =>{
    const usuarioId = res.locals.usuario.id 

    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });

    res.render('nuevoProyecto', {
        nombrePaginas : 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) => {   
    const usuarioId = res.locals.usuario.id 

    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });
    //Enviar a la consola lo que el usuario escriba
    //console.log(req.body)

    //Validar que tengamos al en el input
    const {nombre} = req.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto': 'DEBES AGREGAR UN NOMBRE'});
    }

    //SI hay errores
    if(errores.length > 0){
            res.render('nuevoProyecto', {
                nombrePaginas : 'Nuevo Proyecto',
                errores,
                proyectos
            });
    }else{  
        const usuarioId = res.locals.usuario.id;     
       const proyectos = await Proyectos.create({nombre, usuarioId});
       res.redirect('/');
            
    }
}

exports.proyectosPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id 

    const proyectosPromise = Proyectos.findAll({
        where: {
            usuarioId: usuarioId,
        }
    });


    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId: usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //Consultar tareas del proyecto
    const tareas = await Tareas.findAll({
        where:{
            proyectoId: proyecto.id
        },
        include: [
            {
                model: Proyectos
            }
        ]
    });

    console.log(tareas);

    if(!proyecto) next();

    res.render('tareas', {
        nombrePaginas: 'Tareas del Proyecto',
       proyecto,
       proyectos,
       tareas
    })
}

exports.formularioEditar = async(req, res) => {
    const usuarioId = res.locals.usuario.id 

    const proyectosPromise = Proyectos.findAll({
        where: {
            usuarioId: usuarioId,
        }
    });
    
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId: usuario
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto', {
        nombrePaginas: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req, res) => {   
    const usuarioId = res.locals.usuario.id 

    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId: usuarioId,
        }
    });
    //Enviar a la consola lo que el usuario escriba
    //console.log(req.body)

    //Validar que tengamos al en el input
    const {nombre} = req.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto': 'DEBES AGREGAR UN NOMBRE'});
    }

    //SI hay errores
    if(errores.length > 0){
            res.render('nuevoProyecto', {
                nombrePaginas : 'Nuevo Proyecto',
                errores,
                proyectos
            });
    }else{        
        await Proyectos.update(
           {nombre: nombre},
           {where: {id: req.params.id}}
           
        );
       res.redirect('/');
            
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({
        where: {
            url: urlProyecto
        }
    });

    if(!resultado){
        return next();
    }

    res.send('Proyecto Eliminado');
}