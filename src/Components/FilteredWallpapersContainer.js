import React, { Component } from 'react';
import axios from 'axios';
import FilteredWallpaperCreator from './FilteredWallpaperCreator';

class FilteredWallpapersContainer extends Component {

  constructor (props) {
    super(props);
    this.state = {
      childList: []
    };
    this.createNewFilteredWallpaper = this.createNewFilteredWallpaper.bind(this);
    this.addChild = this.addChild.bind(this);
  }

  componentWillMount() {
    axios.get('http://localhost:8000/data/wallpapers').then(res => {
      res.data.forEach(wallpaper => {
        this.addChild(wallpaper.id, wallpaper.filter, wallpaper.path);
      });
    });
  }

  createNewFilteredWallpaper() {
    // id will be new, filter will be default blank filter
    axios.post('http://localhost:8000/createblank').then(res => {
      this.addChild(res.data.id, res.data.filter, '');
    });
  }

  addChild(id, filter, fileName) {
    const newChild = (<FilteredWallpaperCreator key={id} id={id} filter={filter} fileName={fileName} />);
    const children = this.state.childList.concat(newChild);
    this.setState({
      childList: children
    });
  }

  render() {
    return (
      <div className="filtered-wallpapers-container">
        <button id="create-new" onClick={this.createNewFilteredWallpaper}>Add New</button>
        <div id="filtered-wallpapers">
          {this.state.childList.map(function(input, index) {
            return input;
          })}
        </div>
      </div>
    );
  }
}

export default FilteredWallpapersContainer;
