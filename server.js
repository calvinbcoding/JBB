const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
require('./db/db')

const authorsController = require('./controllers/authors');

// bodyParser is middleware that makes the body
// of our requests readable then send it to the next function
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));


app.use('/authors', authorsController);




app.listen(3000, () => {
  console.log('listening... on port: ', 3000);
});
