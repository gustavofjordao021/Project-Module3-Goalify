const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Goal = require("../models/Goal.model");
const Action = require("../models/Action.model");

const routeGuard = require("../configs/route-guard.config");

// POST Create a goal
router.post("/create-goal", routeGuard, (req, res, next) => {
  const { goalName, goalDueDate, goalTarget, goalOwner } = req.body;
  Goal.create({
    goalName,
    goalDueDate,
    goalTarget,
    goalOwner,
  })
    .then((newGoal) => {
      User.findByIdAndUpdate(
        newGoal.goalOwner,
        { $push: { goals: newGoal._id } },
        { new: true }
      )
        .populate("goals")
        .then((updatedUser) => {
          console.log(updatedUser);
          res.status(200).json({ currentUser: updatedUser });
        });
    })
    .catch((errorMessage) => console.log(errorMessage));
});

// GET Open goal details
router.get("/all-goals", routeGuard, (req, res, next) => {
  Goal.find()
    .populate("goalOwner")
    .populate("actions")
    .then((allGoals) => {
      res.status(200).json(allGoals);
    })
    .catch((err) => res.status(500).json(err));
});

// // POST Update goal details
// router.post("/:goalId/update", routeGuard, (req, res, next) => {
//   const { goalName, goalDueDate, goalTarget } = req.body;
//   Goal.findByIdAndUpdate(
//     req.params.goalId,
//     {
//       goalName,
//       goalDueDate,
//       goalTarget,
//     },
//     { new: true }
//   )
//     .then((updatedGoal) => {
//       res.status(200).json(updatedGoal);
//     })
//     .catch((err) => res.status(500).json(err));
// });

// POST Update goal details
router.post("/:goalId/update", routeGuard, (req, res, next) => {
  const { goalName, goalDueDate, goalTarget } = req.body;
  Goal.findByIdAndUpdate(
    req.params.goalId,
    {
      goalName,
      goalDueDate,
      goalTarget,
    },
    { new: true }
  )
    .then((updatedGoal) => {
      User.findById(updatedGoal.goalOwner)
        .populate("goals")
        .populate("actions")
        .then((userFound) => {
          res.status(200).json(userFound);
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
});

// POST Delete goal
router.post("/:goalId/delete", routeGuard, (req, res, next) => {
  Goal.findByIdAndDelete(req.params.goalId)
    .then(() => {
      User.findByIdAndUpdate(
        req.user._id,
        { $pull: { goals: req.params.goalId } },
        { new: true }
      )
        .then((updatedUser) => {
          res.status(200).json(updatedUser);
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
});

// POST Create an action
router.post("/:goalId/new-action", routeGuard, (req, res, next) => {
  const { actionName, actionDescription } = req.body;
  Action.create({
    actionName,
    actionOwner: req.user._id,
    actionDescription,
  })
    .then((actionCreated) => {
      Goal.findByIdAndUpdate(
        req.params.goalId,
        { $push: { goalActions: actionCreated._id } },
        { new: true }
      )
        .then((updatedGoal) => {
          res.status(200).json(updatedGoal);
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
});

// POST Update an action
router.post("/:goalId/:actionId/update", routeGuard, (req, res, next) => {
  const { actionName, actionDescription } = req.body;
  Action.findByIdAndUpdate({
    actionName,
    actionDescription,
  })
    .then((actionUpdated) => {
      res.status(200).json(actionUpdated);
    })
    .catch((err) => res.status(500).json(err));
});

// POST Delete an action
router.post("/:goalId/:actionId/update", routeGuard, (req, res, next) => {
  Action.findByIdAndDelete(req.params.actionId)
    .then((actionDeleted) => {
      Goal.findByIdAndUpdate(
        req.params.goalId,
        { $pull: { goalActions: actionDeleted._id } },
        { new: true }
      )
        .then((updatedGoal) => {
          res.status(200).json(updatedGoal);
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
