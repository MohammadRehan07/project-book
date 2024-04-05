const user=require("../models/user")
const roleModel=require("../models/roles")
const bcrypt=require("bcrypt")
const jwt = require('jsonwebtoken');
module.exports.createUser=async(req,res)=>{
    try{
        let data = req.body
        let hashedPassword = bcrypt.hashSync(data.password, 10)
        data.password = hashedPassword  
const dataCreate = await user.create(data)
return res
.status(201)
.send({ status: true, message: "created", data: dataCreate });
    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
};

module.exports.userLogin = async function (req, res) {
    try {
      let data = req.body
      let { email, password } = data
      if (!email || !password) {
        return res.status(400).send({ status: false, message: "email and password is mandatory" })
      }
   
      let findUser = await user.findOne({ email: email })
      if (!findUser) {
        return res.status(404).send({ status: false, message: "email or password is not correct" })
      }
      let hashPasswordDB = findUser.password
      bcrypt.compare(password, hashPasswordDB, function (err, result) {
        if (result != true) {
          return res.status(400).send({ status: false, message: "invalid password" })
        }
  
        let createToken = jwt.sign({userId: findUser.id.toString()}, process.env.jwt_secret,{ expiresIn: "30m" })
        res.setHeader('authorization', createToken)
        let finalResponse = {
          userId: findUser.id,
          token: createToken
        }
        return res.status(200).send({ status: true, message: "user login successfully", data: finalResponse })
      })
    }
    catch (error) {
      res.status(500).send({ status: false, message: error.message })
    }
  }
  