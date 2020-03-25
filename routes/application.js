const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Goal = require('../models/Goal.model');
const Action = require('../models/Action.model');

const routeGuard = require('../configs/route-guard.config');

// GET App homepage
router.get('/', routeGuard, (req, res, next) => {
  User.findById(req.user._id)
    .populate('goals')
    .populate('actions')
    .then(currentUser => {
      res.status(200).json(currentUser)
    })
    .catch(err => res.status(500).json(err));
});

// GET App homepage
router.get('/', routeGuard, (req, res, next) => {
  User.findById(req.user._id)
    .populate('goals')
    .populate('actions')
    .then(currentUser => {
      res.status(200).json(currentUser)
    })
    .catch(err => res.status(500).json(err));
});

// POST Create a goal
router.post('/create-goal', routeGuard, (req, res, next) => {
  const { goalName, goalDescription, goalDueDate, goalTarget } = req.body;
  Goal.create({
    goalName, 
    goalDescription, 
    goalDueDate, 
    goalTarget,
    goalOwner: req.user._id
  })
  .then(newGoal => {
    res.status(200).json(newGoal)
  })
  .catch(err => res.status(500).json(err));
})

// GET Open goal details
router.get('/:goalId', routeGuard, (req, res, next) => {
  Goal.findById(req.params.goalId)
    .populate('actions')
    .then(currentGoal => {
      res.status(200).json(currentGoal)
    })
    .catch(err => res.status(500).json(err));
});

// POST Update goal details
router.post('/:goalId/update', routeGuard, (req, res, next) => {
  const { goalName, goalDescription, goalDueDate, goalTarget } = req.body;
  Goal.findByIdAndUpdate(req.params.goalId, {
    goalName, 
    goalDescription, 
    goalDueDate, 
    goalTarget
  }, {new: true})
    .then(updatedGoal => {
      res.status(200).json(updatedGoal)
    })
    .catch(err => res.status(500).json(err));
});

// POST Delete goal
router.post('/:goalId/delete', routeGuard, (req, res, next) => {
  Goal.findByIdAndDelete(req.params.goalId)
    .then(() => {
      User.findByIdAndUpdate(
        req.user._id,
        {$pull: {goals: req.params.goalId}},
        {new: true}
      )
        .then(updatedUser => {
          res.status(200).json(updatedUser)
        })
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
});

// POST Create an action
router.post('/:goalId/new-action', routeGuard, (req, res, next) => {
  const { actionName, actionDescription} = req.body;
  Action.create({
    actionName,
    actionOwner: req.user._id,
    actionDescription,
    })
    .then(actionCreated => {
      Goal.findByIdAndUpdate(
        req.params.goalId,
        {$push: {goalActions: actionCreated._id}},
        {new: true}
      )
        .then(updatedGoal => {
          res.status(200).json(updatedGoal)
        })
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
});

// POST Update an action
router.post('/:goalId/:actionId/update', routeGuard, (req, res, next) => {
  const { actionName, actionDescription} = req.body;
  Action.findByIdAndUpdate({
    actionName,
    actionDescription,
    })
    .then(actionUpdated => {
      res.status(200).json(actionUpdated)
    })
    .catch(err => res.status(500).json(err));
});

// POST Delete an action
router.post('/:goalId/:actionId/update', routeGuard, (req, res, next) => {
  Action.findByIdAndDelete(req.params.actionId)
    .then(actionDeleted => {
      Goal.findByIdAndUpdate(
        req.params.goalId,
        {$pull: {goalActions: actionDeleted._id}},
        {new: true}
      )
        .then(updatedGoal => {
          res.status(200).json(updatedGoal)
        })
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
});


module.exports = router;