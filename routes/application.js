const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Goal = require('../models/Goal.model');
const Action = require('../models/Action.model')

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


module.exports = router;