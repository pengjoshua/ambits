import React from 'react';
import TimePicker from 'material-ui/TimePicker';

const SelectTime = (props) => {
  let date = null;

  if (props.startTime) {
    let time = props.startTime.split(":");
    let hours = time[0];
    let minutes = time[1];
    date = new Date(0,0,0,hours,minutes);
  }


  return (
    <div>
      <TimePicker
        defaultTime={date}
        hintText="Select Ambit Time"
        autoOk={true}
        onChange= {props.onSelectTime}
      />
    </div>
  );

};

export default SelectTime;
