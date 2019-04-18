const express = require('express');
const router  = express.Router();
const Author  = require('../models/authors');


router.get('/new', (req, res) => {
  res.render('authors/new.ejs');
});

router.get('/:id', (req, res) => {
  Author.findById(req.params.id, (err, foundAuthor) =>{
    if(err){
      res.send(err);
    } else {
      res.render('authors/show.ejs', {
        author: foundAuthor
      });
    }
  });
});

router.delete('/:id', (req, res)=> {
  Author.findByIdAndRemove(req.params.id, (err, deletedAuthor) => {
    if(err){
      res.send(err);
    } else {
      res.redirect('/authors');
    }
  })
})

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
