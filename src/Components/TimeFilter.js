import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimePicker from 'react-time-picker';

class TimeFilter extends Component {
  render() {
    return (
      <div className="time-picker">
        <p>from</p>
        <TimePicker
          value={this.props.from}
          onChange={value => this.props.changeTimeHandler(value, true)}
          disableClock={true}
          format='h:m a'
        />
        <p>to</p>
        <TimePicker
          value={this.props.to}
          onChange={value => this.props.changeTimeHandler(value, false)}
          disableClock={true}
          format='h:m a'
        />
      </div>
    );
  }
}

TimeFilter.propTypes = {
  changeTimeHandler: PropTypes.func.isRequired,
  from: PropTypes.string,
  to: PropTypes.string
};

export default TimeFilter;
