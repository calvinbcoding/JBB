const express = require('express');
const router  = express.Router();

router.get('/new', (req, res) => {
  res.render('authors/new.ejs');
});



module.exports = router;
