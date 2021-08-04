const { response } = require('express');
const User = require('../models/user.model');

class BaseController {

  _model;

  constructor(model) {
    this._model = model;
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  ///////////////////////////////////////
  /*                 GET               */
  ///////////////////////////////////////
  get = async (req, res) => {
    console.log("GET REQUEST");
    const result = await this._model.find({}); //Sería como establecer su propio Dto sin necesidad de definirlo. Nos seguiría saliendo el _id y la __v. Esto se soluciona en el user.model.js
    res.json({
      ok: true,
      msg: `All ${this._model.modelName}s loaded`,
      result
    });
  }


  //////////////////////////////////////////
  /*                 POST                 */
  //////////////////////////////////////////
  create = async (req, res = response) => {
    console.log("POST REQUEST");
    try {
      const entity = new this._model(req.body);
      await entity.save();
      res.status(200).json({
        ok: true,
        msg: `${this._model.modelName} CREATED sucessfully`,
        entity
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
  update = async (req, res = response) => {
    console.log("PUT REQUEST");
    const uid = req.params.id;
    try {
      const dbEntity = await User.findById(uid);
      if (!dbEntity) {
        console.log("Register NOT FOUND by Id");
        return res.status(404).json({
          ok: false,
          msg: `${this._model.modelName} NOT FOUND by uid = ${uid}`,
        });
      }
      const updatedEntity = await this._model.findByIdAndUpdate(uid, { new: true }); //{new: true} hace que en el momento de la actualización devuelva el usuario nuevo y no el guardado hasta ahora
      res.json({
        ok: true,
        user: updatedEntity,
        msg: `${this._model.modelName} uid = ${uid} UPDATED sucessfully`,
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
  delete = async (req, res = response) => {
    console.log("DELETE REQUEST");
    const uid = req.params.id;
    try {
      const dbEntity = await this._model.findById(uid);
      if (!dbEntity) {
        console.log("Entity does not exists");
        return res.status(404).json({
          ok: false,
          msg: "Entity not found by Id = " + uid
        });
      }
      await this._model.findByIdAndDelete(uid);
      return res.json({
        ok: true,
        msg: `${this._model.modelName} uid = ${uid} DELETED sucessfully`,
        user: dbEntity
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
  BaseController
}