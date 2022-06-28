import http from 'http'
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config()
import { router as rtPeople } from './routes/people'
import { router as rtPlaces } from './routes/places'

const app = express()

app.use(morgan('dev')) // logging
app.use(express.json()) // parsing json
app.use(express.urlencoded({ extended: false })) // parsing urlencoded

// api rules
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*')
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
   if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET, OPTIONS')
      return res.status(200).json({})
   }
   next()
})

// register routes
app.use('/', rtPeople)
app.use('/', rtPlaces)

// error handling
app.use((req, res, next) => {
   const error = new Error('not found')
   return res.status(404).json({ message: error.message })
})

// server
const port = Number(process.env.PORT) || 8000
app.set('port', port)
const server = http.createServer(app)
server.listen(port, () => {
   console.log(`server started on port ${process.env.PORT}`)
})