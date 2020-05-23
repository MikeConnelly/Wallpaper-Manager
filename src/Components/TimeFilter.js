import React, { Component } from 'react';
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

export default TimeFilter;
