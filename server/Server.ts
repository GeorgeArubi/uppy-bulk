import express, { Express } from "express";
import bodyParser from 'body-parser'
import AWS from 'aws-sdk'

// This is for our env config, to get our api key from the .env
const dotenv = require('dotenv');
dotenv.config();

export class Server {

    private app: Express;

    constructor(app: Express) {
        // This will setup AWS
        AWS.config.update({
            credentials: {
                accessKeyId: process.env.USER_ACCESS_KEY,
                secretAccessKey : process.env.USER_SECRET_KEY
            }, 
            region: process.env.BUCKET_REGION
        });
        const s3 = new AWS.S3();

        this.app = app;

        /** ---------- MIDDLEWARE ---------- **/
        this.app.use(bodyParser.json()); 
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(express.static('build'));


        /** ---------- EXPRESS ROUTES ---------- **/

        // GET - signed url for upload
        this.app.get('/api/signurl/put/:filename', (req, res) => {
            const presignedPutUrl = s3.getSignedUrl('putObject', {
                Bucket: process.env.BUCKET_NAME,
                Key: req.params.filename, //filename
                Expires: 5 * 60 //time to expire in seconds - 5 min
            });
            console.log('sending presigned url', presignedPutUrl);
            res.send({url: presignedPutUrl})
        })
        
        // GET - signed URL to view
        this.app.get('/api/signurl/get/:filename', (req, res) => {
            const presignedGetUrl = s3.getSignedUrl('getObject', {
                Bucket: process.env.BUCKET_NAME,
                Key: req.params.filename, 
                Expires: 100 //time to expire in seconds - 5 min
            });
            console.log('sending presigned url', presignedGetUrl);
            res.send({url: presignedGetUrl})
        })
        
        // GET signed urls for all images in the s3 bucket
        this.app.get('/api/image', (req, res) => {
            const params = {
            Bucket: process.env.BUCKET_NAME 
            };
            s3.listObjectsV2(params, (err, data) => {
            console.log('S3 List', data);
            // Package signed URLs for each to send back to client
            let images = []
            for (let item of data.Contents) {
                let url = s3.getSignedUrl('getObject', {
                    Bucket: process.env.BUCKET_NAME,
                    Key: item.Key, 
                    Expires: 100 //time to expire in seconds - 5 min
                });
                images.push(url);
            }
            res.send(images);
            })
        })        
    }

    public start(port: number): void {
        this.app.listen(port, (err?: any) => {
            if (err) throw err;
            console.log(`> Listening on port:${port}`);
          });
    }
}
