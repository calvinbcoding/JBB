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
  // All the authors
  // know which author the article belongs too
  // article
  Author.find({}, (err, allAuthors) => {
    Author.findOne({'articles': req.params.id})
      .populate({path: 'articles', match: {_id: req.params.id}})
      .exec((err, foundArticleAuthor) => {
        console.log(foundArticleAuthor, "<==== foundArticleAuthor")
        if(err){
          res.send(err);
        } else {
          res.render('articles/edit.ejs', {
            article: foundArticleAuthor.articles[0],
            authors: allAuthors,
            articleAuthor: foundArticleAuthor
          })
        }
      })

  })
});

router.put('/:id', (req, res)=>{
 //if the author is changed,
 // 1 . then the article goes into a different author's array
 // 2. and is removed from the original author's array of articles
  Article.findByIdAndUpdate(req.params.id, req.body, {new: true},(err, updatedArticle)=>{
    // find the author that owns the article
    Author.findOne({'articles': req.params.id}, (err, foundAuthor) => {

      if(foundAuthor._id.toString() !== req.body.authorId){
        // so if I'm inside of the if
        // that means the client sent a request with the author changed
        foundAuthor.articles.remove(req.params.id);
        // removed the article reference from the original author ^
        foundAuthor.save((err, savedFoundAuthor) => {
          // Find the new author and add the article refence to its articles array
          Author.findById(req.body.authorId, (err, newAuthor) => {

            // updated article is reference in the Article query at the top
            newAuthor.articles.push(updatedArticle);
            newAuthor.save((err, savedNewAuthor) => {
              res.redirect('/articles/' + req.params.id);
            })

          })

        })
      } else {
        // if the author didn't change everything was taken care of in
        // the orginal Article query on line 100
        res.redirect('/articles/' + req.params.id)
      }


    })



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
