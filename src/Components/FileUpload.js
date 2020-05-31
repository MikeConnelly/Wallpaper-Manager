import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FileUpload extends Component {
  render() {
    return (
      <div className="add-file">
        <button className="choose-button" onClick={this.props.chooseFileHandler}>Choose a file</button>
        <p id="selected-file-name">{ this.props.value ? this.props.value : 'No File Selected'}</p>
      </div>
    );
  }
}

FileUpload.propTypes = {
  chooseFileHandler: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default FileUpload;
