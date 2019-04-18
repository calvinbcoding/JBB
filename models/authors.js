const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: String
});

// in mongodb it is creating an authors collection,
// second arg, is specifying what all the documents in our
// collection should look
const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
