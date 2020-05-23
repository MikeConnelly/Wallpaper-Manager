import React, { Component } from 'react';

class FileUpload extends Component {

  render() {
    return (
      <div className="add-file">
        <button onClick={this.props.chooseFileHandler}>Choose a file</button>
        <p id="selected-file-name">{ this.props.value ? this.props.value : 'No File Selected'}</p>
      </div>
    );
  }
}

export default FileUpload;
