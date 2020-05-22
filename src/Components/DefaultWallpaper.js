import React, { Component } from 'react';
import axios from 'axios';
import FileUploader from './FileUpload';

class DefaultWallpaper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      defaultWallpaper: ''
    };
  }

  componentDidMount() {
    axios.get('http://localhost:8000/data/default').then(res => {
      this.setState({ defaultWallpaper: res.data });
    });
  }

  render() {
    return (
      <div id="default-wallpaper">
        <h2>default wallpaper</h2>
        <FileUploader setDefault={true} value={this.state.defaultWallpaper} />
      </div>
    );
  }
}

export default DefaultWallpaper;
