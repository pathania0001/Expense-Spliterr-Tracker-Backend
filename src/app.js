
const express = require('express');
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser');
const { COOKIE_SIGN} = require('./config');
const authRoutes = require('./routes/auth');
const routes = require('./routes');

const {mongoDB} = require('./db')
mongoDB();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001","https://splitrr-mern-frontend.vercel.app/"],    
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
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