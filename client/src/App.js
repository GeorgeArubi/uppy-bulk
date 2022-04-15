import React, { Component } from 'react';
import Uploader from './components/UploadModalButton';
import Gallery from './components/Gallery';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Working w/ AWS S3 and Uppy</h1>
        </header>
        <Uploader />
      </div>
    );
  }
}

export default App;