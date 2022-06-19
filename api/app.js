import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'
import { auth } from 'express-oauth2-jwt-bearer'
import faunadb from 'faunadb'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(cors({
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
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

app.get('/authorized', async (req, res) => {
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

 app.get('/upload', async (req, res) => {
   //https://flaviocopes.com/node-aws-s3-upload-image/
 })

 export { app }