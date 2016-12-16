import React from 'react';
import DatePicker from 'material-ui/DatePicker';

const StartDate = (props) => (
  <div>
    <DatePicker
      defaultDate={props.startDate !== null ? new Date(props.startDate) : undefined}
      hintText="Select Ambit Start Date"
      onChange= {props.onStartDateSet}
      autoOk= {true}
      locale="en-US"
      firstDayOfWeek={0}
      />
  </div>
);


export default StartDate;
