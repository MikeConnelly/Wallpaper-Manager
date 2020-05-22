import React, { Component } from 'react';
import axios from 'axios';

class FileUpload extends Component {

  constructor (props) {
    super(props);
    this.state = {
      setDefault: props.setDefault || false,
      selectedFile: null
    };
  }

  chooseFileHandler() {
    axios.post("http://localhost:8000/file", {
      setDefault: this.state.setDefault,
      filters: {}
    }).then(res => {
        document.getElementById('selected-file-name').innerText = res.data;
      });
  }

  render() {
    return (
      <div className="add-file">
        <button onClick={this.chooseFileHandler}>Choose a file</button>
        <p id="selected-file-name">{ this.props.value ? this.props.value : 'No File Selected'}</p>
      </div>
    );
  }
}

export default FileUpload;
