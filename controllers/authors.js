const express = require('express');
const router  = express.Router();
const Author  = require('../models/authors');
const Article = require('../models/articles');

router.get('/new', (req, res) => {
  res.render('authors/new.ejs');
});

router.get('/:id', (req, res) => {
  Author.findById(req.params.id)
    .populate('articles')
    .exec((err, foundAuthor) => {
      console.log(foundAuthor, "<----- foundAuthor in the show route")

      res.render('authors/show.ejs', {
        author: foundAuthor
      });
    });
});

router.delete('/:id', (req, res)=> {
  Author.findByIdAndRemove(req.params.id, (err, deletedAuthor) => {

    // Delete the Articles from the Author in the Articles model
    if(err){
      res.send(err);
    } else {
      console.log(deletedAuthor, "<--- deletedAuthor");
      Article.deleteMany({
        _id: {
          $in: deletedAuthor.articles // array of article ids to delete
        }
      }, (err, data) => {
        console.log(data, ' after the remove')
        res.redirect('/authors');
      })

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

router.get('/:id/edit', (req, res)=>{
  Author.findById(req.params.id, (err, foundAuthor)=>{
    res.render('authors/edit.ejs', {
      author: foundAuthor
    });
  });
});

router.put('/:id', (req, res)=>{
  Author.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedAuthor)=>{
    if(err){
      res.send(err);
    } else {
      res.redirect('/authors');
    }
  });
});
module.exports = router;
