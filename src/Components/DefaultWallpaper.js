import React, { Component } from 'react';
import axios from 'axios';
import FileUploader from './FileUpload';

class DefaultWallpaper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      defaultWallpaper: ''
    };
    this.chooseFileHandler = this.chooseFileHandler.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:8000/data/default').then(res => {
      this.setState({ defaultWallpaper: res.data });
    });
  }

  chooseFileHandler() {
    axios.post("http://localhost:8000/default", {}).then(res => {
      this.setState({ defaultWallpaper: res.data });
    });
  }

  render() {
    return (
      <div id="default-wallpaper">
        <h2>Default Wallpaper</h2>
        <FileUploader value={this.state.defaultWallpaper} chooseFileHandler={this.chooseFileHandler} />
      </div>
    );
  }
}

export default DefaultWallpaper;
