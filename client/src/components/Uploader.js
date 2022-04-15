import React, { Component } from 'react';
import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import Axios from 'axios';
import { Dashboard } from '@uppy/react'
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';


class Uploader extends Component {

  constructor(props) {

    super(props);

    this.state = {
      modalOpen: false
    }

    // Create & configure Uppy instance
    this.uppy = new Uppy({
      id: 'uppy',
      restrictions: { 
        maxFileSize: 100000000, //100MB
        allowedFileTypes: ['audio/*'],
        maxNumberOfFiles: 1,
      },
      autoProceed: false,
      debug: true
    })

    // Tell it to use their AWS S3 plugin
    // Will get pre-signed URL from server API
    this.uppy.use(AwsS3, {
      getUploadParameters (file) {
        console.log('file: ', file);
        return Axios(`/api/signurl/put/${file.name}`)
          .then(response => {
            console.log('response: ', response);
            // Return an object in the correct shape.
            return {
              method: 'PUT',
              headers: {
                accept: 'application/json',
                'content-type': 'application/json',
              }, 
              url: response.data.url,
              fields: []
            }
          });
      }
    })
  }

  componentWillUnmount () {
    // Close the Uppy instance
    this.uppy.close()
  }

  render () {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <div className="max-w-xs rounded overflow-hidden shadow-lg my-2">
          <Dashboard className="w-full" uppy={this.uppy} />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Uppy Bulk Upload</div>
            <p className="text-grey-darker text-base">
               Frontend: React, Uppy and Tailwind CSS. This interface should allow for drag/drop 
              and file input methods. I think we can target a div id to build custom components.
              See: 
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Uploader;