const express = require('express');
const router = express.Router();
const User   = require('../models/users');
const bcrypt = require('bcryptjs');


router.get('/login', (req, res) => {
  res.render('login.ejs', {
    message: req.session.message
  })
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

    // after you create the user, this is a great time to initialize you session object
    // add properties to the session object
    req.session.logged = true;
    req.session.usersDbId = createdUser._id;

    res.redirect('/authors');

  } catch(err){
    res.send(err)
  }



});


// To compare our password and the hash we use compareSync
// bcrypt.compareSync('you plain text password', 'hashedPassword')  // return true or false

// make the form in login.ejs make a request to this
router.post('/login', async (req, res) => {

  // Query the database to see if the user exists
  try {
    const foundUser = await User.findOne({'username': req.body.username});

    // Is foundUser a truthy value, if it is its the user object,
    // if we didn't find anything then foundUser === null a falsy value
    if(foundUser){

      // since the user exist compare the passwords
      if(bcrypt.compareSync(req.body.password, foundUser.password) === true){
        // set up the session
        res.session.message = '';
        req.session.logged = true;
        req.session.usersDbId = foundUser._id;

        console.log(req.session, ' successful in login')
        res.redirect('/authors');

      } else {
        // redirect them back to the login with a message
        req.session.message = "Username or password is incorrect";
        res.redirect('/auth/login');
      }

    } else {

      req.session.message = 'Username or Password is incorrect';

      res.redirect('/auth/login');
    }


  } catch(err){
    res.send(err);
  }





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
