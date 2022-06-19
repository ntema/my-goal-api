const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const errorHandler = require('express-async-handler')
const User = require('../models/userModel')
//@desc  post users
//route  POST api/users
//access Public
const registerUser =errorHandler(async(req, res) => {
    //check for empty input fields
    const {name, email, password} = req.body
    if(!name || !email || !password){
        res.status(400)
        throw new Error('please add all fields')
    }

    //check if user exist
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('user already exist')
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    //create user
    const user =await User.create({
        name,
        email,
        password:hashedPassword
    })
    if(user){
        res.status(201).json({
            message: 'user registered successfully',
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('invalid user data')
    }
})
//@desc  post users
//route  POST api/users
//access Public
const loginUser = errorHandler(async(req, res) =>{
    const {email,password} = req.body

    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password, user.password))){
        res.status(201).json({
            message: 'Login successful',
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('invalid credentials')
    }
})
//@desc  get users
//route  GET api/users
//access Private
const getMe = errorHandler(async(req, res) => {
    const {_id, name, email} =await User.findById(req.user.id)
    res.status(200).json({id: _id,name,email})
})

//Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn:'30d',})
}

module.exports = {registerUser,loginUser,getMe,}