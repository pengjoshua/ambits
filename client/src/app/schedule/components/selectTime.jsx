import React from 'react';
import TimePicker from 'material-ui/TimePicker';

const centerStyle = {
  width: '100%',
  textAlign: 'center'
}

const leftStyle = {
  textAlign: 'left'
}

const SelectTime = (props) => {
  let date = null;

  if (props.startTime) {
    let time = props.startTime.split(":");
    let hours = time[0];
    let minutes = time[1];
    date = new Date(0,0,0,hours,minutes);
  }

  return (
    <div style={{marginBottom: '15px',}}>
      <TimePicker
        defaultTime={date}
        fullWidth={true}
        hintStyle={centerStyle}
        floatingLabelStyle={leftStyle}
        floatingLabelFocusStyle={leftStyle}
        inputStyle={centerStyle}
        errorStyle={centerStyle}
        hintText="Select Ambit Time"
        floatingLabelText="Ambit Time"
        errorText={(props.errorcheck) ? 'required' : ''}
        autoOk={true}
        onChange= {props.onSelectTime}
      />
    </div>
  );

};

export default SelectTime;
