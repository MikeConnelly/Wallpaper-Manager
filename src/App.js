import React from 'react';
import axios from 'axios';
import FileUploader from './Components/FileUpload';
import './App.css';

function applyChangesHandler() {
  axios.post('http://localhost:8000/apply')
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div id="default-wallpaper">
          <h2>default wallpaper</h2>
          <FileUploader/>
          <button id="apply-button" onClick={applyChangesHandler}>Apply</button>
        </div>
      </header>
    </div>
  );
}

export default App;
