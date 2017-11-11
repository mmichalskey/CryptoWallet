const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user')

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) =>{
    if(err)
    {
      res.json({success: false, msg:'Nie można zarejestrować użytkownika.'});
    }
    else
    {
      res.json({success: true, msg:'Użytkownik został zarejestrowany.'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.getUserByEmail(email, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg:'Nie znaleziono użytkownika.'});
    }
    User.comparePasswords(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign({user}, config.secret, {
          expiresIn: '10m', //1 week
          algorithm: 'HS256'
        });
        
        res.json({
          success: true, 
          token:`JWT ${token}`,
          user: {
            id: user._id,
            name: user.name,
            emai: user.email
          }
        });
      }
      else{
        return res.json({success: false, msg:'Nieprawidłowe hasło.'});
      }
    });
  });
 });

 // Profile
router.get('/profile', passport.authenticate('jwt', {session:false}) , (req, res, next) => {
  res.json({user: req.user});
 });

  // Validate
router.get('/validate', (req, res, next) => {
  res.send('Validate');
 });


module.exports = router;
