import React, { Component } from 'react'
import axios from 'axios';

class FileUpload extends Component {

  constructor (props) {
    super(props);
    this.state = {
      selectedFile: null
    };
    //this.handleClick = this.handleClick.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
  }
/*
  handleClick(e) {
    this.refs.fileUploader.click();
  }
*/
  onChangeHandler(e) {
    console.log(e.target.files[0]);
    this.setState({
      selectedFile: e.target.files[0],
      loaded: 0
    });
  }

  onClickHandler() {
    const data = new FormData();
    data.append('file', this.state.selectedFile);
    axios.post("http://localhost:8000/upload", data, {})
      .then(res => { // then print response status
        console.log(res.statusText)
      })
  }

  chooseFile() {
    axios.post("http://localhost:8000/file", {}, {})
      .then(res => {
        console.log(res);
      });
  }

  render() {
    return (
      <div className="add-file">
        <button onClick={this.chooseFile}>Choose a file</button>
        <button onClick={this.onClickHandler}>Upload</button>
      </div>
    );
  }
  // <input type="file" name="file" onChange={this.onChangeHandler}></input>
}

export default FileUpload;
/*

      <div className="add-file" onClick={this.handleClick}>
        <p>click this</p>
        <input type="file" id="file" ref="fileUploader" style={{display: 'none'}}/>
      </div>
      */