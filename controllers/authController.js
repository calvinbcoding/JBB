const express = require('express');
const router = express.Router();

// this is what the session looks like on the client
// 's%3ABwt2E_dsM-nCo-c4S4JN4b0RLKRT5msC.s8%2BbdNFBLnpBKyC6DMuIRgfanpd%2BFvYtH8RZQedndPY'

router.get('/test', (req, res) => {
  console.log("=========================")
  console.log(req.session);
  console.log("=========================")
  req.session.myOwnPropertyIMadeUp = 'Cheese';
  console.log("=========================")
  console.log(req.session);
  console.log("=========================")
  res.send('hi test')
});


router.get('/login', (req, res) => {
  res.render('login.ejs')
});






module.exports = router;
