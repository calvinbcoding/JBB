const express = require('express');
const router = express.Router();
const Article = require('../models/articles');
const Author  = require('../models/authors');

router.get('/new', (req, res)=>{
  // I want to add all the authors, so user can select
  // select the author the article belongs to  when they are going to create an article
  Author.find({}, (err, allAuthors) => {
    if(err){
      res.send(err);
    } else {
      res.render('articles/new.ejs', {
        authors: allAuthors
      });
    }
  });

});


router.get('/', (req, res)=>{
  Article.find({}, (err, foundArticles)=>{
    if(err){
      res.send(err);
    } else {
      res.render('articles/index.ejs', {
        articles: foundArticles
      });
    }
  });
});

router.post('/', (req, res)=>{
  Article.create(req.body, (err, createdArticle)=>{
    if(err){
      res.send(err);
    } else {
      Author.findById(req.body.authorId, (err, foundAuthor) => {
        console.log("===========================")
        console.log(foundAuthor);
        console.log("===========================")
        foundAuthor.articles.push(createdArticle);
        foundAuthor.save((err, savedAuthor) => {
          console.log('============================')
          console.log(savedAuthor, ' <----------');
          console.log('============================')
          res.redirect('/articles');
        });

      });


    }
  });
});

// articles show route
router.get('/:id', (req, res)=>{
  // req.params.id is the articles id
  Author.findOne({'articles': req.params.id})
    .populate({path: 'articles', match: {_id: req.params.id}})
    .exec((err, foundAuthor) => {
      console.log(foundAuthor, "<---- foundAuthor in article show route");
      res.render('articles/show.ejs', {
        author: foundAuthor,
        article: foundAuthor.articles[0]
      })
    })

});

router.get('/:id/edit', (req, res)=>{
  Article.findById(req.params.id, (err, foundArticle)=>{
    if(err){
      res.send(err);
    } else {
      res.render('articles/edit.ejs', {
        article: foundArticle
      });
    }
  });
});

router.put('/:id', (req, res)=>{
  Article.findByIdAndUpdate(req.params.id, req.body, {new: true},(err, foundArticle)=>{
    if(err){
      res.send(err);
    } else {
       res.redirect('/articles');
    }

  });
});

router.delete('/:id', (req, res)=>{
  Article.findByIdAndRemove(req.params.id, (err, deletedArticle)=>{

    // find the author and then remove the articles id from their articles array of ids
    Author.findOne({'articles': req.params.id}, (err, foundAuthor) => {
      if(err){
        res.send(err);
      } else {
        console.log(foundAuthor, "<---- foundAuthor in delete before I remove the article id")
        foundAuthor.articles.remove(req.params.id);
        // since we just mutated our document ^ , now we have to save
        foundAuthor.save((err, updatedAuthor) => {
          console.log(updatedAuthor, ' after the mutation');
          res.redirect('/articles');
        });
      }
    });
  });
});













module.exports = router;
