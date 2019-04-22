const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const session        = require('express-session');
require('./db/db')

const authorsController  = require('./controllers/authors');
const articlesController = require('./controllers/articles');
const authController     = require('./controllers/authController');
// bodyParser is middleware that makes the body
// of our requests readable then send it to the next function
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));

// before our controllers
app.use(session({
  secret: 'This is a random secret string that you would make up to protect your session',
  resave: false, // says only save the cookie if there has been a change to one of properties
  saveUninitialized: false // only save when we have mutated the session,
  //this is what should be done for logins, many laws make you do this as well
}))


// app.use((req, res, next) => {

// })


app.use('/authors', authorsController);
app.use('/articles', articlesController);
app.use('/auth', authController);


app.listen(3000, () => {
  console.log('listening... on port: ', 3000);
});
