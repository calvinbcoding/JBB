const express = require('express');
const router = express.Router();
const Article = require('../models/articles');


router.get('/new', (req, res)=>{
  res.render('articles/new.ejs');
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
