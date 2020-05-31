import React from 'react';
import DefaultWallpaper from './Components/DefaultWallpaper';
import FilteredWallpapersContainer from './Components/FilteredWallpapersContainer';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="app-body">
        <div className="col-left">
          <DefaultWallpaper />
        </div>
        <div className="col-right">
          <h2>Wallpapers</h2>
          <FilteredWallpapersContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
