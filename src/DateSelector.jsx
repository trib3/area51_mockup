import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import DatePicker from 'rc-calendar/lib/Picker';
import moment from 'moment';
import React from 'react';

import enUS from 'rc-calendar/lib/locale/en_US';

const format = 'MM/DD/YYYY';
const fullFormat = 'ddd MM/DD/YYYY';

class Picker extends React.Component {

  render() {
    const props = this.props;
    const { showValue } = props;
    const calendar = (
      <RangeCalendar
        type={this.props.type}
        locale={enUS}
        defaultValue={moment()}
        format={format}
        onChange={props.onChange}
        disabledDate={props.disabledDate}
      />);
    return (
      <DatePicker
        open={this.props.open}
        onOpenChange={this.props.onOpenChange}
        calendar={calendar}
        value={props.value}
      >
        {
          () => {
            return (
              <span>
                <input
                  placeholder="Select Date Range"
                  readOnly
                  value={showValue && showValue.format(fullFormat) || ''}
                />
                </span>
            );
          }
        }
      </DatePicker>);
  }
}

export default class DateSelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      startValue: this.props.initStartDate,
      endValue: this.props.initEndDate,
      startOpen: false,
      endOpen: false,
    }
  }

  onStartOpenChange(startOpen) {
    this.setState({startOpen});
  }

  onEndOpenChange(endOpen) {
    this.setState({endOpen});
  }

  onStartChange(value) {
    this.setState({
      startValue: value[0],
      startOpen: false,
      endOpen: true,
    });
  }

  onEndChange(value) {
    this.setState({endValue: value[1]});
    this.props.update(value[0], value[1]);
  }

  disabledStartDate(endValue) {
    if (!endValue) {
      return false;
    }
    const startValue = this.state.startValue;
    if (!startValue) {
      return false;
    }
    return endValue.diff(startValue, 'days') < 0;
  }

  render() {
    const state = this.state;
    return (
      <div style={{ width: 100, margin: 0 }}>
        <div>
          <h3>date range</h3>
          <Picker
            onOpenChange={this.onStartOpenChange.bind(this)}
            type="start"
            showValue={state.startValue}
            open={this.state.startOpen}
            value={[state.startValue, state.endValue]}
            onChange={this.onStartChange.bind(this)}
          />
        </div>
        <div>
          <Picker
            onOpenChange={this.onEndOpenChange.bind(this)}
            open={this.state.endOpen}
            type="end"
            showValue={state.endValue}
            disabledDate={this.disabledStartDate.bind(this)}
            value={[state.startValue, state.endValue]}
            onChange={this.onEndChange.bind(this)}
          />
        </div>
      </div>
    );
  }
}
