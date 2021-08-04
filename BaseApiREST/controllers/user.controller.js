const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt');
const { BaseController } = require('./base.controller');
const { sendCustomMail } = require('./../helpers/mail');

class UserController extends BaseController {

  constructor(model) {
    super(model);
  }

  ///////////////////////////////////////
  /*                 GET               */
  ///////////////////////////////////////
  getUsers = async (req, res) => {
    console.log("USER GET REQUEST");
    const users = await User.find({}, 'nombre email role google'); //Sería como establecer su propio Dto sin necesidad de definirlo. Nos seguiría saliendo el _id y la __v. Esto se soluciona en el user.model.js
    res.json({
      ok: true,
      msg: `Users were LOADED sucessfully`,
      users,
      userRequestId: req.uid
    });
  }



  //////////////////////////////////////////
  /*                 POST                 */
  //////////////////////////////////////////
  createUser = async (req, res = response) => {
    console.log("USER POST REQUEST");
    const { email, password } = req.body;
    try {
      const existeEmail = await User.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: 'Email is already registered in system'
        });
      }
      const user = new User(req.body);

      /************************************* 
       *       Password encriptation
      *************************************/
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync(password, salt);
      ///////////////////////////////////////


      //Save user
      let dbUser = await user.save();

      /************************************* 
       *          JWT Generation
      *************************************/
      const token = await generateJWT(dbUser.id);
      ///////////////////////////////////////

      sendCustomMail('digitalislandsp@gmail.com', dbUser.email, 'Registro completado!!!', 'Tu registro en el sistema se ha completado correctamente');


      res.status(200).json({
        ok: true,
        msg: `User ${user.name} CREATED sucessfully`,
        user,
        token
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "An error ocurred. Read logs."
      });
    }
  }


  ////////////////////////////////////////
  /*                PUT                */
  ///////////////////////////////////////
  updateUser = async (req, res = response) => {
    console.log("USER PUT REQUEST");
    const uid = req.params.id;
    try {
      const dbUser = await User.findById(uid);
      if (!dbUser) {
        console.log("User does not exists");
        return res.status(404).json({
          ok: false,
          msg: "User does not exists"
        });
      }
      // TODO: VALIDAR TOKEN Y COMPROBAR SI ES EL USUARIO CORRECTO
      //Save user 
      const { password, google, email, ...fields } = req.body; //Para que no me traiga el password y el google y evitar tener que hacer el delete comentado más abajo [ *1 ]

      if (dbUser.email !== email) {
        // Si se esta tratando de actualizar con el OTRO correo, compruebo que no exista ya para algún usuario
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
          console.log("Email already registered for other user in database");
          return res.status(500).json({
            ok: false,
            msg: "Email already registered for other user in database"
          });
        }
      }
      // Las dos siguientes líneas serían innecesarias al hacer la desestructuración del req.users arriba [ *1 ]
      // delete fields.password;
      // delete fields.google;
      fields.email = email; //Vuelvo a setear el email para tenerlo en cuenta a partir de aquí
      const updatedUser = await User.findByIdAndUpdate(uid, fields, { new: true }); //{new: true} hace que en el momento de la actualización devuelva el usuario nuevo y no el guardado hasta ahora
      res.json({
        ok: true,
        user: updatedUser,
        msg: `User uid=${uid} UPDATED sucessfully`,
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "An error ocurred. Read logs."
      });
    }
  }




  //////////////////////////////////////////////
  /*                DELETE                  */
  //////////////////////////////////////////////
  deleteUser = async (req, res = response) => {
    console.log("USER DELETE REQUEST");
    const uid = req.params.id;
    try {
      const dbUser = await User.findById(uid);
      if (!dbUser) {
        console.log("User does not exists");
        return res.status(404).json({
          ok: false,
          msg: "User does not exists"
        });
      }
      await User.findByIdAndDelete(uid);
      return res.json({
        ok: true,
        msg: `User uid=${uid} DELETED sucessfully`,
        user: dbUser
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        error: error
      });
    }

  }
}

/* EXPORTACIONES */
module.exports = {
  UserController
}