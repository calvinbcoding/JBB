const express = require('express');
const router = express.Router();
const Article = require('../models/articles');
const Author  = require('../models/authors');

router.get('/new', async (req, res)=>{
  try {
       // We are retrieving all the Authors's and storing them in
      // a variable called allAuthors, THEN the render method
      // can finally be executed

      // also we are finding all the authors so
      // we can list them in a dropdown so the user
      // can choose an author for an article
      // when they are creating a new article
      // Please go look at the articles/new.ejs now
      // and think about what is happening on the page
     const allAuthors = await Author.find({});


    res.render('articles/new.ejs', {
        authors: allAuthors
      });

  } catch (err) {

      res.send(err);
  }
});


router.get('/', async (req, res)=>{

       try  {
            // We are retrieving all the Article's and storing them in
            // a variable called foundArticle, THEN the render method
            // can finally be executed
            const foundArticles = await Article.find({});
            // this happens after the await is finished
            res.render('articles/index.ejs', {
              articles: foundArticles,
            });

          } catch (err){

            res.send(err);
          }
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
router.get('/:id', async (req, res)=>{
  // req.params.id is the articles id
  try {
      const foundAuthor = await Author.findOne({'articles': req.params.id}).populate({path: 'articles', match: {_id: req.params.id}})

      console.log(foundAuthor, "<---- foundAuthor in article show route");
      res.render('articles/show.ejs', {
        author: foundAuthor,
        article: foundAuthor.articles[0]
      })

  } catch(err){
    res.send(err);
  }

});

router.get('/:id/edit', async (req, res)=>{
   // For the edit, we need to allow the user to Select all the authors when they are editing the
  // author, thats why we are performing Author.find

  // then we need to find the article and the author who owns the article that we
  // are trying to edit
  // thats why we are using Author.findOne
  // we are using .populate to find all the articles
  // we use match, to only populate the article that matches the article we are trying to edit


  try {
      // Here we are defining are database queries
      // we can wait for both of them to finish, instead of await
      // each one, because the result from each one are not
      // dependent on each other,
      // we can wait for the concurrently by using Promise.all as seen
      // below
      const findAllAuthors = Author.find();
      const findArticleAuthor = Author.findOne({'articles': req.params.id}).populate({path: 'articles', match: {_id: req.params.id}})

      // Promise All returns an array of the repsonse from DB queries,
      // Using array destructing to save the corresponding responses
      // as the variables thisArticle, and foundAuthor
      // the array destructering is the const [allAuthors, foundArticle]
      // Basially what this is doing is creating varaibles for each index in the array that
      // is returned from await Promise.all([findAllAuthors, findArticleAuthor])
      //if you are still confused look up array destructering, its fancy new javascript
      const [allAuthors, foundArticleAuthor] = await Promise.all([findAllAuthors, findArticleAuthor]);

       res.render('articles/edit.ejs', {
            article: foundArticleAuthor.articles[0],
            authors: allAuthors,
            articleAuthor: foundArticleAuthor
          })

  } catch (err) {
      console.log(err, ' err hitting')
      res.send(err);

  }
});

router.put('/:id', async (req, res) =>{
      try {

          const findUpdatedArticle = Article.findByIdAndUpdate(req.params.id, req.body, {new: true});

          const findFoundAuthor = Author.findOne({'articles': req.params.id });

          // For running pararrell async taks
          const [updatedArticle, foundAuthor ] = await Promise.all([findUpdatedArticle, findFoundAuthor])


          // What is this check for again?


          // If the if is true, then what is happening?

          // That means the user changed the author on the edit page
          if(foundAuthor._id.toString() != req.body.authorId){

                // This line is removing the article from
                // the original author's array or articles
                foundAuthor.articles.remove(req.params.id);
                // then we are saving the original authors array
                await foundAuthor.save();
                // then we are finding the new author and adding the article
                // to the newAuthor's array
                const newAuthor = await Author.findById(req.body.authorId);
                newAuthor.articles.push(updatedArticle);
                // now we are saving the new authors array
                const savedNewAuthor = await newAuthor.save();
                // if you want to go back to the show page you can do something like this
                res.redirect('/articles/' + req.params.id);


          } else {
            console.log('hitting, else')
            res.redirect('/articles/' + req.params.id);

          }


        } catch (err){
          console.log(err)
          res.send(err);
        }

});

router.delete('/:id', async (req, res)=>{
  // Delete the article, is the purpose of line 153
  try {
        // Once again we are defining both are database queries, that
        // are not dependant on each other (the results don't depend on each other)
        // and we just have to await Promise.all below for them to finish
        // so we can remove the article from the author? Why do we have to do this?
        const deleteArticle = Article.findByIdAndRemove(req.params.id);
        const findAuthor    = Author.findOne({'articles': req.params.id});

        const [deletedArticle, foundAuthor] = await Promise.all([deleteArticle, findAuthor]);

        // Why do we have to find the author
        // then remove the article from the foundAuthor document?
        // If we remove an article from the Article COllection,
        // does it automatically remove from the author collection?
        foundAuthor.articles.remove(req.params.id);
        // Don't forget to save! the document back to the database
        await foundAuthor.save();
        console.log('happening ')
        res.redirect('/articles');

    } catch(err){

      console.log(err)
      res.send(err);
    }
});

module.exports = router;
