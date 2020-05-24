import React from 'react';
import DefaultWallpaper from './Components/DefaultWallpaper';
import FilteredWallpapersContainer from './Components/FilteredWallpapersContainer';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="app-body">
        <DefaultWallpaper />
        <FilteredWallpapersContainer />
      </div>
    </div>
  );
}

export default App;
