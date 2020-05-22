import React from 'react';
import axios from 'axios';
import DefaultWallpaper from './Components/DefaultWallpaper';
import './App.css';

function applyChangesHandler() {
  axios.post('http://localhost:8000/apply');
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DefaultWallpaper />
        <button id="apply-button" onClick={applyChangesHandler}>Apply</button>
      </header>
    </div>
  );
}

export default App;
