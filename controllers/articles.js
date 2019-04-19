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
      res.redirect('/articles');
    }
  });
});


router.get('/:id', (req, res)=>{
  Article.findById(req.params.id, (err, foundArticle)=>{
    if(err){
      res.send(err);
    } else {

      res.render('articles/show.ejs', {
        article: foundArticle
      });

    }

  });
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
    if(err){
      res.send(err);
    } else {
      res.redirect('/articles');
    }

  });
});













module.exports = router;
