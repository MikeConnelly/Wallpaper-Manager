import React, { Component } from 'react';
import axios from 'axios';
import TimeFilter from './TimeFilter';
import FileUpload from './FileUpload';

class FilteredWallpaperCreator extends Component {
  
  constructor (props) {
    super(props);
    this.state = {
      id: props.id,
      fileName: props.fileName,
      fromTime: props.filter.time.from,
      toTime: props.filter.time.to
    };
    this.updateFilter = this.updateFilter.bind(this);
    this.changeTimeHandler = this.changeTimeHandler.bind(this);
    this.chooseFileHandler = this.chooseFileHandler.bind(this);
  }

  updateFilter(newFilter) {
    axios.put(`http://localhost:8000/filter/${this.state.id}`, newFilter);
  }

  changeTimeHandler(value, fromBool) {
    const newFilter = this.props.filter;
    if (fromBool) {
      this.setState({ fromTime: value });
      newFilter.time.from = value;
    } else {
      this.setState({ toTime: value });
      newFilter.time.to = value;
    }
    this.updateFilter(newFilter);
  }

  chooseFileHandler() {
    axios.put(`http://localhost:8000/file/${this.state.id}`, {}).then(res => {
      this.setState({ fileName: res.data });
    });
  }
  
  render() {
    // NOTE FILTER MAY NOT HAVE TIME FIELD????????? OR MAYBE IT WILL FUCK IF I KNOW I HAVE TO MAKE IT
    return (
      <div className="filtered-wallpaper-creator">
        <TimeFilter changeTimeHandler={this.changeTimeHandler} from={this.state.fromTime} to={this.state.toTime} />
        <FileUpload value={this.state.fileName} chooseFileHandler={this.chooseFileHandler} />
      </div>
    );
  }
}

export default FilteredWallpaperCreator;
