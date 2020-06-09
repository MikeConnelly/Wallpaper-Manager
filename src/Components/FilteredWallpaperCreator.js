import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Draggable } from 'react-beautiful-dnd';
import TimeFilter from './TimeFilter';
import WeatherFilter from './WeatherFilter';
import FileUpload from './FileUpload';

class FilteredWallpaperCreator extends Component {
  
  constructor (props) {
    super(props);
    this.state = {
      id: props.id,
      fileName: props.fileName,
      fromTime: props.filter.time.from,
      toTime: props.filter.time.to,
      weather: props.filter.weather
    };
    this.updateFilter = this.updateFilter.bind(this);
    this.changeTimeHandler = this.changeTimeHandler.bind(this);
    this.changeWeatherHandler = this.changeWeatherHandler.bind(this);
    this.chooseFileHandler = this.chooseFileHandler.bind(this);
  }

  chooseFileHandler() {
    axios.put(`http://localhost:8000/file/${this.state.id}`, {}).then(res => {
      this.setState({ fileName: res.data });
    });
  }

  updateFilter(newFilter) {
    axios.put(`http://localhost:8000/filter/${this.state.id}`, newFilter).then(res => {
      this.setState({
        fromTime: newFilter.time.from,
        toTime: newFilter.time.to,
        weather: newFilter.weather
      });
    });
  }

  changeTimeHandler(value, fromBool) {
    if (!value) { value = ''; }
    const newFilter = this.props.filter;
    if (fromBool) {
      newFilter.time.from = value;
    } else {
      newFilter.time.to = value;
    }
    this.updateFilter(newFilter);
  }

  changeWeatherHandler(newWeather) {
    if (!newWeather || newWeather === 'None') { newWeather = ''; }
    const newFilter = this.props.filter;
    newFilter.weather = newWeather;
    this.updateFilter(newFilter);
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
            <WeatherFilter value={this.state.weather} changeWeatherHandler={this.changeWeatherHandler} />
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
    }),
    weather: PropTypes.string
  }),
  deleteHandler: PropTypes.func.isRequired
};

export default FilteredWallpaperCreator;
