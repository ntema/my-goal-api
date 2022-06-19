const asyncHandler = require('express-async-handler')
const Goals = require('../models/goalModel')
const Users = require('../models/userModel')
//@desc  get goals
//route  GET api/goals
//access Private
const getGoals =asyncHandler(async(req,res) => {
    const goals = await Goals.find({user: req.user.id});
    res.status(200).json({goals})
})
//@desc  set goal
//route  POST api/goals
//access Private
const setGoal = asyncHandler(async(req,res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error('please add a text field')
    }
    const goal = await Goals.create({
        text: req.body.text,
        user: req.user.id
    })
    res.status(200).json(goal)
})
//@desc  update goal
//route  PUT api/goals
//access Private
const updateGoal= asyncHandler(async(req,res) => {
    const goal = await Goals.findById(req.params.id)
    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await Users.findById(req.user.id)
    //check for user
    if(!user){
        res.status(400)
        throw new Error('user not found')
    }
// make sure logged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(400)
        throw new Error('User access to Goal not authorized. please confirm your token')
    }
    const updatedGoal = await Goals.findByIdAndUpdate(req.params.id, {$set: req.body}, {new:true})
    res.status(200).json(updatedGoal)
})
//@desc  delete goal
//route  DELETE api/goals
//access Private
const deleteGoal = asyncHandler(async(req,res) => {
    const goal = await Goals.findById(req.params.id)
    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }
    const user = await Users.findById(req.user.id)
    //check for user
    if(!user){
        res.status(400)
        throw new Error('user not found')
    }
// make sure logged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(400)
        throw new Error('User access to Goal not authorized. please confirm your token')
    }

    const deletedGoal = await goal.remove()
    res.status(200).json({message: `goal with id ${req.params.id} deleted`})
})
module.exports ={getGoals,setGoal,updateGoal,deleteGoal}