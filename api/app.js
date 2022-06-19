const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const { auth } = require('express-oauth2-jwt-bearer')
const faunadb = require('faunadb')
require('dotenv').config()

const app = express()

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
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
    audience: process.env.AUTH0_AUDIENCE
  })
)

// fauna setup
const client = new faunadb.Client({
  secret: process.env.FUANA_CLIENT_SECRET,
  domain: process.env.FAUNA_DOMAIN,
  port: 443,
  scheme: 'https',
})

app.get('/authorized', async function(req, res) {
   const q = faunadb.query
   const resp = await client.query(
      q.Map(
         q.Paginate(q.Documents(q.Collection('people'))),
         q.Lambda(x => q.Get(x))
      )
   )
   console.log(resp)
   res.send(resp)
 })

module.exports = app
