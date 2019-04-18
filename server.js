const express = require('express');
const app     = express();

require('./db/db')



app.listen(3000, () => {
  console.log('listening... on port: ', 3000);
});
