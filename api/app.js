import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'
import { auth } from 'express-oauth2-jwt-bearer'
import faunadb from 'faunadb'
import dotenv from 'dotenv'
import aws from 'aws-sdk'
const { S3 } = aws

dotenv.config()
const app = express()
app.use(cors({
  origin: '*', // ['http://localhost:3000'],
  optionsSuccessStatus: 200
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use(
//   auth({
//     issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
//     audience: process.env.AUTH0_AUDIENCE
//   })
// )

// fauna setup
const client = new faunadb.Client({
  secret: process.env.FUANA_CLIENT_SECRET,
  domain: process.env.FAUNA_DOMAIN,
  port: 443,
  scheme: 'https',
})

const remoteQuery = async (res, getQry) => {
  const q = faunadb.query
  const resp = await client.query(getQry(q))
  console.log(resp)
  res.send(resp)
}

const getPeopleQry = q => q.Map(
  q.Paginate(q.Documents(q.Collection('people'))),
  q.Lambda(x => q.Get(x))
)

const getPersonQry = (q, id) => q.Get(
  q.Ref(q.Collection('people'), id)
)

const newPersonQry = (q, data) =>
  q.Create(
    q.Collection('people'),
    { data }
  )

app.get('/people', async (req, res) =>
  await remoteQuery(
    res, q => req.query.id 
            ? getPersonQry(q, req.query.id)
            : getPeopleQry(q)
))

app.post('/people', async (req, res) => {
  const { id, ...data } = await req.body
  await remoteQuery(res, q => newPersonQry(q, data))
})

app.patch('/people', async (req, res) => {
  const { id, ...data } = await req.body
  await remoteQuery(res, q =>
    q.Update(
      q.Ref(q.Collection('people'), req.body.id),
      { data }
))})

const s3 = new S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
})

app.get('/upload', async (req, res) => {
  const imgUri = 'https://static.wikia.nocookie.net/armaea/images/4/48/Cassius_Aeremaeus.jpg'
  const response = await fetch(imgUri)
  const blob = Buffer.from(await response.arrayBuffer())
  const uploaded = await s3.upload({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: 'Cassius_Aeremaeus.jpg',
    Body: blob
  }).promise()
  console.log(uploaded)

  //https://flaviocopes.com/node-aws-s3-upload-image/
})

app.get('/download', async (req, res) => {
  const Key = 'Cassius_Aeremaeus.jpg'
  const response = await s3.getObject({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key
  }).promise()
  res.attachment(Key)
  res.send(response.Body)
})

export { app }