const express = require('express');
const router  = express.Router();
const Author  = require('../models/authors');


router.get('/new', (req, res) => {
  res.render('authors/new.ejs');
});

// index route
router.get('/', (req, res) => {
  // show all of the resource
  Author.find({}, (err, foundAuthors) => {
    if(err){
      res.send(err)
    } else {
      res.render('authors/index.ejs', {
        authors: foundAuthors
      })
    }
  });
});

router.post('/', (req, res) => {
  console.log(req.body);
  Author.create(req.body, (err, createdAuthor) => {
    if(err){
      res.send(err);
    } else {
      res.redirect('/authors');
    }
  })

});

module.exports = router;
