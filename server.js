const express = require('express');
const bodyParser = require('body-parser');
const companion = require('@uppy/companion');
const path = require('path');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const cors = require('cors')

const app = express()
const DATA_DIR = path.join(__dirname, 'tmp')

app.use(cors({
  origin: 'http://localhost:9966',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'PATCH'],
}))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:9966')
  next()
})

// Routes
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain')
  res.send('Welcome to Companion')
})

app.use(cookieParser())
app.use(bodyParser.json())
app.use(session({
  secret: 'some-secret-II',
  resave: true,
  saveUninitialized: true,
}))

const options = {
  providerOptions: {
    s3: {
    getKey: (req, filename, metadata) => `uppy/${Math.random().toString(32).slice(2)}/${filename}`,
    key: process.env.COMPANION_AWS_KEY,
    secret: process.env.COMPANION_AWS_SECRET,
    bucket: process.env.COMPANION_AWS_BUCKET,
    region: process.env.COMPANION_AWS_REGION,
    },
    // you can also add options for additional providers here
  },
  server: {
      host: 'localhost:3020',
      protocol: 'http', // 'http' || 'https'
      path: '/companion',
  },
  filePath: DATA_DIR,
  secret: 'some-secret',
  uploadUrls: 'http://localhost:9966',
  debug: true,
  allowLocalUrls: true, // Only enable this in development
  acl: 'public-read',
  maxFileSize: 1000000000,
}

// Create the data directory here for the sake of the example.
try {
  fs.accessSync(DATA_DIR)
} catch (err) {
  fs.mkdirSync(DATA_DIR)
}
process.on('exit', () => {
  fs.rmSync(DATA_DIR, { recursive: true, force: true })
})

app.use('/companion', companion.app(options))

const server = app.listen(3020, () => {
  console.log('listening on port 3020')
})

companion.socket(server)