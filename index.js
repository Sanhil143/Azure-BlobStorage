const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const path = require('path');
require('dotenv').config();
const azureRoute = require('./src/server/router');
const azureClientRoute = require('./src/client/router')
const app = express();

app.use(session({
  secret:'sanhil',
  resave:false,
  saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb',
      })
    );
app.use(cookieParser());    
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/azure',azureRoute);
app.use('/azureClient',azureClientRoute);

app.listen(3000, () => {
  console.log("Express app running on console");
});