const express = require('express');
const router  = express.Router();
const Author  = require('../models/authors');


router.get('/new', (req, res) => {
  res.render('authors/new.ejs');
});

router.post('/', (req, res) => {
  console.log(req.body);
  Author.create(req.body, (err, createdAuthor) => {
    if(err){
      res.send(err);
    } else {
      res.send(createdAuthor)
    }
  })

});

module.exports = router;
