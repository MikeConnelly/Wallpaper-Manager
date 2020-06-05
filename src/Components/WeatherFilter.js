import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const options = [
  'None',
  'Sunny',
  'Rainy',
  'Cloudy',
  'Foggy',
  'Windy',
  'Snowy',
  'Thunderstorm'
];

class WeatherFilter extends Component {
  render() {
    return (
      <Dropdown
        options={options}
        onChange={weather => this.props.changeWeatherHandler(weather.value)}
        value={this.props.value}
        placeholder='Select Weather'
      />
    );
  }
}

WeatherFilter.propTypes = {
  value: PropTypes.string,
  changeWeatherHandler: PropTypes.func.isRequired
};

export default WeatherFilter;
