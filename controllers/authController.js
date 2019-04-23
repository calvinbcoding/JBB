const express = require('express');
const router = express.Router();
const User   = require('../models/users');

router.get('/login', (req, res) => {
  res.render('login.ejs')
});

// make the form in login.ejs make a request to this
router.post('/login', (req, res) => {

  //2 set a property to the session called username that is equal to the username from the form
  req.session.username = req.body.username;
  // set a property to the session called logged and make it true
  req.session.logged = true;
  // So now the client is now logged in ^
  res.redirect('/authors');
});


router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err){
      res.send(err);
    } else {
      res.redirect('/auth/login');
    }
  })
})




module.exports = router;
