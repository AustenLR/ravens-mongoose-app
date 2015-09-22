var db = require("../models");

var routeHelpers = {
  ensureLoggedIn: function(req, res, next) {
    console.log('id?',req.session.id);
    if (req.session.id !== null && req.session.id !== undefined) {
      return next();
    }
    else {
     res.redirect('/login');
    }
  },

  ensureCorrectUser: function(req, res, next) {
    db.Raven.findById(req.params.id, function(err,raven){
      if (raven.ownerId !== req.session.id) {
        res.redirect('/ravens');
      }
      else {
       return next();
      }
    });
  },

  preventLoginSignup: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      res.redirect('/ravens');
    }
    else {
     return next();
    }
  }
};
module.exports = routeHelpers;