
const express = require('express');
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser');
const { COOKIE_SIGN} = require('./config');

app.use(cors({
    origin : "*",
    credentials : true  
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))


module.exports = app