const express = require('express')
const router = require('express').Router()
const {getGoals,setGoal,updateGoal,deleteGoal} = require('../controller/goalsController')
const {protect} = require('../middleware/authMiddleware')

router.route('/').get(protect,getGoals).post(protect,setGoal)
router.route('/:id').put(protect,updateGoal).delete(protect,deleteGoal)


module.exports = router;