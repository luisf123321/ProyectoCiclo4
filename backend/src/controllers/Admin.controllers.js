const AdminCtrl = {};

const Admin = require('../models/Admin.model');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

AdminCtrl.crearAdmin = async(req,res)=>{

    const {nombre,apellido,telefono,direccion,correo,contrasena} = req.body;

    const NuevoAdmin = new Admin({

        nombre,
        apellido,
        telefono,
        direccion,
        correo,
        contrasena
    })

    const correoadmin = await Admin.findOne({correo:correo});

    if(correoadmin){
        res.json({
            mensaje: 'El correo ya existe'
        })
    }
    else{
        NuevoAdmin.contrasena = await bcrypt.hash(contrasena,10);
        const token = jwt.sign({_id:NuevoAdmin._id},'Secreta');
        await NuevoAdmin.save();
        res.json({
            mensaje: 'Registrado con exito',
            id: NuevoAdmin._id,
            nombre: NuevoAdmin.nombre,
            apellido: NuevoAdmin.apellido,
            token
        })
    }
}

AdminCtrl.login = async(req,res)=>{

    const {correo,contrasena} = req.body
    const admin = await Admin.findOne({correo:correo})
    if(!admin){

        return res.json({
            mensaje:'Correo incorrecto'
        })
    }

    const match = await bcrypt.compare(contrasena,admin.contrasena);

    if(match){
        const token = jwt.sign({_id:admin._id},'Secreta');
        res.json({
            mensaje: 'Bienvenido',
            id: admin._id,
            nombre: admin.nombre,
            token
        })
    }
    else{
        res.json({
            mensaje:'Contraseña incorrecta'
        })
    }
}

module.exports = AdminCtrl