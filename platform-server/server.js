const express = require('express')
const dbConfig = require('./db/config');
const bodyParser = require('body-parser');
const router = require('./router');
const db = require('./db/init').getDatabase();

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(router);

db.connect((err) => {
  if (err) {
    console.log('Unable to connect to Database.')
    process.exit(1)
  } else {
    app.listen(3001, () => console.log('Example app listening on port 3001!'));
  }
});
