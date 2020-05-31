import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimePicker from 'react-time-picker';

class TimeFilter extends Component {
  render() {
    return (
      <div className="time-picker">
        <div className="time">
          <div className="time-col-left">
            <p className="time-text">from</p>
            <p className="time-text">to</p>
          </div>
          <div className="time-col-right">
            <TimePicker
              value={this.props.from}
              onChange={value => this.props.changeTimeHandler(value, true)}
              disableClock={true}
              format='h:m a'
            />
            <TimePicker
              value={this.props.to}
              onChange={value => this.props.changeTimeHandler(value, false)}
              disableClock={true}
              format='h:m a'
            />
          </div>
        </div>
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
