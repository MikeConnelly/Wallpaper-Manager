import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Draggable } from 'react-beautiful-dnd';
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
    if (!value) { value = ''; }
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
    return (
      <Draggable draggableId={`${this.state.id}`} index={this.props.index}>
        {provided => (
          <div
            className="filtered-wallpaper-creator"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <TimeFilter changeTimeHandler={this.changeTimeHandler} from={this.state.fromTime} to={this.state.toTime} />
            <FileUpload value={this.state.fileName} chooseFileHandler={this.chooseFileHandler} />
            <button className="delete-button" onClick={e => this.props.deleteHandler(this.state.id)}>Delete</button>
          </div>
        )}
      </Draggable>
    );
  }
}

FilteredWallpaperCreator.propTypes = {
  index: PropTypes.number,
  id: PropTypes.number,
  fileName: PropTypes.string,
  filter: PropTypes.shape({
    time: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string
    })
  }),
  deleteHandler: PropTypes.func.isRequired
};

export default FilteredWallpaperCreator;
