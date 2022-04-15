const fs = require('fs')
const path = require('path')
const companion = require('@uppy/companion')
const app = require('express')()
const cors = require('cors')

const DATA_DIR = path.join(__dirname, 'tmp')

const corsOptions = {
  origin: ['*'],
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions));

app.use(require('cookie-parser')())
app.use(require('body-parser').json())
app.use(require('express-session')({
  secret: 'hello-planet',
  resave: true,
  saveUninitialized: true
}))

const options = {
  providerOptions: {
    s3: {
      getKey: (req, filename) => `whatever/${Math.random().toString(32).slice(2)}/${filename}`,
      key: process.env.COMPANION_AWS_KEY,
      secret: process.env.COMPANION_AWS_SECRET,
      bucket: process.env.COMPANION_AWS_BUCKET,
      region: process.env.COMPANION_AWS_REGION
    },
  },
  server: { 
    host: 'localhost:3020',
    protocol: 'http' 
  },
  filePath: DATA_DIR,
  uploadUrls: 'http://localhost:9966',
  secret: 'blaah-blah',
  debug: true,
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


app.use(companion.app(options))

const server = app.listen(3020, () => {
  console.log('listening on port 3020')
})

companion.socket(server)