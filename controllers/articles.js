const express = require('express');
const router = express.Router();
const Article = require('../models/articles');
const Author  = require('../models/authors');

router.get('/new', (req, res)=>{
  // Here we are finding all the authros
  // so we can create the select menu inside of articles/new
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

       // Here we are finding the author that owns the article
      // req.body.authorId What is is coming from look at the new route, at the secect menu
      // what is the name property
      Author.findById(req.body.authorId, (err, foundAuthor) => {
        console.log("===========================")
        console.log(foundAuthor, "<=== found author in article Post");
        console.log("===========================")

        // after we found the author we are pushing the reference into the authors articles array
            // What is the array? Its the thing we defined in the model, also look at the console.log on line 45
        foundAuthor.articles.push(createdArticle);
        foundAuthor.save((err, savedAuthor) => {
          console.log('============================')
          console.log(savedAuthor, ' <---------- savedAuthor in article post route');
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
   // For the edit, we need to allow the user to Select all the authors when they are editing the
  // author, thats why we are performing Author.find

  // then we need to find the article and the author who owns the article that we
  // are trying to edit
  // thats why we are using Author.findOne
  // we are using .populate to find all the articles
  // we use match, to only populate the article that matches the article we are trying to edit
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
