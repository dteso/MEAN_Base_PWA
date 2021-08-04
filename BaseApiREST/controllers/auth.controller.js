const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { BaseController } = require('./base.controller');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

class AuthController extends BaseController {

  constructor(model) {
    super(model);
  }


  /******************************
   * LOGIN
   ******************************/
  login = async (req, res = response) => {
    const { email, password } = req.body;

    try {
      const dbUser = await User.findOne({ email });
      if (!dbUser) {
        return res.status(500).json({
          ok: false,
          msg: "Login ERROR"
        });
      }


       /*        Password Verification        */
      const validPassword = bcrypt.compareSync(password, dbUser.password);

      if (!validPassword) {
        return res.status(500).json({
          ok: false,
          msg: "Login ERROR"
        });
      }


      /*          JWT Generation        */
      const token = await generateJWT(dbUser.id);
      res.json({
        ok: true,
        msg: 'login ok',
        token,
        user: dbUser
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "An error ocurred. Read logs."
      });
    }
  }



  
  /******************************
   * GOOGLE LOGIN
  ******************************/
  googleSignIn = async (req, res = response ) => {
    const { id_token }  = req.body;
    try{
      const googleUser = await googleVerify(id_token);
      // console.log(googleUser);

      let user =  await User.findOne({email: googleUser.email});
      // console.log(user);
      if(!user){
        const data = {
          name: googleUser.name,
          email: googleUser.email,
          password: "NOT_IMPORTANT",
          google: true
        }
        user = new User(data);
        await user.save();
      }
      
      res.json({
        token: id_token,
        msg: "google sign in success",
        user: googleUser
      })
    }catch(error){
      res.status(300).json({
        ok: false,
        msg: 'Not a valid google token'
      })
    }

  }

}


/* EXPORTACIONES */
module.exports = {
  AuthController
}