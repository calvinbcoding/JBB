const express = require('express');
const router = express.Router();

router.get('/new', (req, res)=>{
  res.render('articles/new.ejs');
});


router.get('/', (req, res)=>{
  res.render('articles/index.ejs');
});



module.exports = router;
