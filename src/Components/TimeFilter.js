import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
// import TimePicker from 'react-time-picker';
// import TimePicker from 'react-time-picker/dist/entry.nostyle';

class TimeFilter extends Component {
  render() {
    return (
      <div className="time-filter">
        <TextField
          id="from-time"
          type="time"
          label="from"
          defaultValue={this.props.from}
          InputLabelProps={{shrink: true}}
          InputProps={{step: 300}}
          onChange={e => this.props.changeTimeHandler(e.target.value, true)}
        />
        <TextField
          id="to-time"
          type="time"
          label="to"
          defaultValue={this.props.to}
          InputLabelProps={{shrink: true}}
          InputProps={{step: 300}}
          onChange={e => this.props.changeTimeHandler(e.target.value, false)}
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

/*
<TimePicker
  value={this.props.from}
  onChange={value => this.props.changeTimeHandler(value, true)}
  disableClock={true}
  format='h:m a'
  hourPlaceholder='hh'
  minutePlaceholder='mm'
/>
<TimePicker
  value={this.props.to}
  onChange={value => this.props.changeTimeHandler(value, false)}
  disableClock={true}
  format='h:m a'
  hourPlaceholder='hh'
  minutePlaceholder='mm'
/>
*/
