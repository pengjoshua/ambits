import React from 'react';
import Checkbox from 'material-ui/Checkbox';

const styles = {
  block: {
    display: 'inline-block',
    minWidth: '50%',
    maxWidth: '50%',
    marginTop: '15px',
    textAlign: 'center',
    verticalAlign: 'middle'
  },
  checkbox: {
    marginBottom: 16,
  },
};
const SelectDays = (props) => (
  <div>
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
    <div style={styles.block}>
      <Checkbox
        defaultChecked={props.weekdays[0] && props.weekdays[1] && props.weekdays[2] && props.weekdays[3] && props.weekdays[4] && props.weekdays[5] && props.weekdays[6]}
        label="Select All"
        style={styles.checkbox}
        onCheck={props.onSelectDays.onSelectDaysInputSelectAll}
      />

      <Checkbox
        defaultChecked={props.weekdays[1] && props.weekdays[2] && props.weekdays[3] && props.weekdays[4] && props.weekdays[5]}
        label="Weekdays"
        style={styles.checkbox}
        onCheck={props.onSelectDays.onSelectDaysInputWeekdays}
      />

      <Checkbox
        defaultChecked={props.weekdays[0] && props.weekdays[6]}
        label="Weekends"
        style={styles.checkbox}
        onCheck={props.onSelectDays.onSelectDaysInputWeekends}
      />

      <Checkbox
        defaultChecked={props.weekdays[1] && props.weekdays[3] && props.weekdays[5]}
        label="Mon-Wed-Fri"
        style={styles.checkbox}
        onCheck={props.onSelectDays.onSelectDaysInputMWF}
      />

      <Checkbox
        defaultChecked={props.weekdays[2] && props.weekdays[4]}
        label="Tue-Thur"
        style={styles.checkbox}
        onCheck={props.onSelectDays.onSelectDaysInputTR}
      />
    </div>
  </div>
);


export default SelectDays;
