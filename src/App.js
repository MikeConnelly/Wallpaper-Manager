import React from 'react';
import DefaultWallpaper from './Components/DefaultWallpaper';
import FilteredWallpapersContainer from './Components/FilteredWallpapersContainer';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DefaultWallpaper />
        <FilteredWallpapersContainer />
      </header>
    </div>
  );
}

export default App;
