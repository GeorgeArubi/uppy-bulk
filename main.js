const Uppy = require('@uppy/core')
const GoogleDrive = require('@uppy/google-drive')
const Webcam = require('@uppy/webcam')
const Dashboard = require('@uppy/dashboard')
const AwsS3 = require('@uppy/aws-s3')

const uppy  = new Uppy({
  autoProceed: false,
  restrictions: {
    maxFileSize: 1000000000, // Uppy options, currently set max file size to 100MB
    minNumberofFile: 1, // Set a max/min number of files
    allowedFileTypes: ['audio/*'] // This restriction is currently set to accept any audio format (for specific file types use 'audio/wav', 'audio/mp3', etc.)
  }  
})
uppy.use(Webcam)
uppy.use(Dashboard, {
  inline: true,
  target: 'body',
  plugins: ['GoogleDrive', 'Webcam'],
})
uppy.use(AwsS3, { 
  companionUrl: 'http://localhost:3020',
  metaFields: ['name', 'bulk-upload'] //  Root URL of the uppy-companion instance
}) 

