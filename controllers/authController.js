const express = require('express');
const router = express.Router();
const User   = require('../models/users');
const bcrypt = require('bcryptjs');


router.get('/login', (req, res) => {
  res.render('login.ejs')
});


// Creating what is called a hash - which is an encrypted string, based on a really
// complex mathmatical formula


// hash string

// Salt is like a key to your hash

// hash and salt get combined

// const hashedString = bcyrpt.hashSync('Your Password here', bcrypt.genSaltSync(10));
router.post('/register', async (req, res) => {

  // First we must hash the password
  const password = req.body.password;
  // The password hash is what we want to put in the Database
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));


  // create an object for the db entry, the properties of this object
  // will match up with our model
  const userDbEntry = {};
  userDbEntry.username = req.body.username;
  userDbEntry.password = passwordHash;

  try {
    const createdUser = await User.create(userDbEntry);

    console.log(createdUser);

    res.send('you registered');

  } catch(err){
    res.send(err)
  }



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
