
const express = require('express');
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser');
const { COOKIE_SIGN} = require('./config');
const authRoutes = require('./routes/auth');
const routes = require('./routes');

app.use(
  cors({
    origin: "http://localhost:3000",       // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"], // allow headers you expect
    credentials: true,  
  })
);



app.use(cookieParser(COOKIE_SIGN))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public"))

app.use('/auth',authRoutes)
app.use('/api',routes)

module.exports = app