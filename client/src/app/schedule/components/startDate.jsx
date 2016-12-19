import React from 'react';
import DatePicker from 'material-ui/DatePicker';

const centerStyle = {
  width: '100%',
  textAlign: 'center'
}

const leftStyle = {
  textAlign: 'left'
}

const StartDate = (props) => (
  <div>
    <DatePicker
      defaultDate={props.startDate !== null ? new Date(props.startDate) : undefined}
      fullWidth={true}
      hintStyle={centerStyle}
      floatingLabelStyle={leftStyle}
      floatingLabelFocusStyle={leftStyle}
      inputStyle={centerStyle}
      errorStyle={centerStyle}
      hintText="Select Ambit Start Date"
      floatingLabelText="Ambit Start Date"
      onChange={props.onStartDateSet}
      autoOk={true}
      errorText={(props.errorCheck) ? 'required' : ((props.errorCheckFuture) ? 'select a present or future date' : '')}
      locale="en-US"
      firstDayOfWeek={0}
      />
  </div>
);


export default StartDate;
