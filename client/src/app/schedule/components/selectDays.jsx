import React from 'react';
import Checkbox from 'material-ui/Checkbox';

const styles = {
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16,
  },
};
const SelectDays = (props) => (
  <div style={styles.block}>
    <Checkbox
      defaultChecked={props.weekdays[0]}
      label="Sunday"
      style={styles.checkbox}
      onCheck={props.onSelectDays.onSelectDaysInputSunday}
    />

    <Checkbox
      defaultChecked={props.weekdays[1]}
      label="Monday"
      style={styles.checkbox}
      onCheck={props.onSelectDays.onSelectDaysInputMonday}
    />

    <Checkbox
      defaultChecked={props.weekdays[2]}
      label="Tuesday"
      style={styles.checkbox}
      onCheck={props.onSelectDays.onSelectDaysInputTuesday}
    />

    <Checkbox
      defaultChecked={props.weekdays[3]}
      label="Wednesday"
      style={styles.checkbox}
      onCheck={props.onSelectDays.onSelectDaysInputWednesday}
    />

    <Checkbox
      defaultChecked={props.weekdays[4]}
      label="Thursday"
      style={styles.checkbox}
      onCheck={props.onSelectDays.onSelectDaysInputThursday}
    />

    <Checkbox
      defaultChecked={props.weekdays[5]}
      label="Friday"
      style={styles.checkbox}
      onCheck={props.onSelectDays.onSelectDaysInputFriday}
    />

    <Checkbox
      defaultChecked={props.weekdays[6]}
      label="Saturday"
      style={styles.checkbox}
      onCheck={props.onSelectDays.onSelectDaysInputSaturday}
    />



  </div>
);


export default SelectDays;
