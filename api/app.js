var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
const { auth } = require('express-oauth2-jwt-bearer')

var app = express()

app.use(cors({
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200
}))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  auth({
    issuerBaseURL: 'https://dev-n8eqgexp.us.auth0.com/',
    audience: 'dnd-api'
  })
)

app.get('/authorized', function(req, res) {
  res.send('Secured Resource')
})

module.exports = app
