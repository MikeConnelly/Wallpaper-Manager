import React, { Component } from 'react'
import axios from 'axios';

class FileUpload extends Component {

  constructor (props) {
    super(props);
    this.state = {
      selectedFile: null
    };
    //this.chooseFileHandler = this.chooseFileHandler.bind(this);
  }

  chooseFileHandler() {
    axios.post("http://localhost:8000/file", { setDefault: true, filters: {} })
      .then(res => {
        console.log(res);
        document.getElementById('selected-file-name').innerText = res.data;
      });
  }

  render() {
    return (
      <div className="add-file">
        <button onClick={this.chooseFileHandler}>Choose a file</button>
        <p id="selected-file-name">No file selected</p>
      </div>
    );
  }
}

export default FileUpload;
