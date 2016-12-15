import React from 'react';
import DropDownList from './dropdown.jsx';
import CommitButton from './commitButton.jsx';
import StartDate from './startDate.jsx';
import SelectDays from './selectDays.jsx';
import AmbitNameInput from './ambitNameInput.jsx';
import SelectTime from './selectTime.jsx';
import SelectFrequency from './selectFrequency.jsx';
import Divider from 'material-ui/Divider';
import * as Utils from '../../utils/utils.js';
import {Coords} from '../../map/map.jsx';


export default class ScheduleContainer extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      name: '',
      coords:{
        latitude: Coords.latitude,
        longitude:Coords.longitude
      },
      // frequency:'',
      weekdays: [false, false, false, false, false, false, false],
      //[Su,M,T,w,Th,F,Sa]
      startDate: null,
      startTime:null,
      checkIns:[]
    };

    this.onNameInput = this.onNameInput.bind(this);
    this.onStartDateSet = this.onStartDateSet.bind(this);
    this.onSelectTime = this.onSelectTime.bind(this);
    this.onScheduleAmbit = this.onScheduleAmbit.bind(this);
    // this.onFrequencyChange = this.onFrequencyChange.bind(this);
    // this.onDropDownSelect = this.onDropDownSelect.bind(this);
    this.onSelectDays = {
      onSelectDaysInputSunday: this.onSelectDaysInputSunday.bind(this),
      onSelectDaysInputMonday: this.onSelectDaysInputMonday.bind(this),
      onSelectDaysInputTuesday: this.onSelectDaysInputTuesday.bind(this),
      onSelectDaysInputWednesday: this.onSelectDaysInputWednesday.bind(this),
      onSelectDaysInputThursday: this.onSelectDaysInputThursday.bind(this),
      onSelectDaysInputFriday: this.onSelectDaysInputFriday.bind(this),
      onSelectDaysInputSaturday: this.onSelectDaysInputSaturday.bind(this),
    };
  }


  onNameInput(nameInput) {
      this.setState({
        name: nameInput.target.value
      });
  }

// Need to reformat date object to not include current time before passing into database
  onStartDateSet(event, date) {
    this.setState({
      startDate: date
    });
    console.log(this.state);
  }


// Need to reformat time object to not include current date before passing into database
  onSelectTime(event, time) {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let newTime = hours + ":" + minutes;

    this.setState({
      startTime: newTime
    });
  }

  onScheduleAmbit() {
    var ambitState = this.state;
    console.log(ambitState);

    Utils.postAmbit(ambitState, function() {
      console.log('posted!');
    });
  }

  // onDropDownSelect(event, index, value) {
  //   this.setState({
  //     dropdownValue: value
  //   });
  //   console.log(this.state.dropdownValue)
  // }


// this function was meant to take in the day index and the checked boolean, however 'this' being bound in the SelectDays module is causing issues with accessing this.state.
//////////////////////////////////////////////////
    // onSelectDaysInput(day, event, checked) {

      // var currentState = this.state;
      // currentState.weekdays[day] = checked;
      // console.log(day, checked);
      // this.setState(currentState);
      // this.setState({
      //   startDate[day] = checked
      // })
      // ;
    // }
    // // time to write some UGLY MFIN CODE.
//////////////////////////////////////////////////


// DONT JUDGE ME, IM PRESSED FOR TIME D;
//////////////////////////////////////////////////
onSelectDaysInputSunday(event, checked) {
  var currentState = this.state;
  currentState.weekdays[0] = checked;
  this.setState(currentState);
}

onSelectDaysInputMonday(event, checked) {
  var currentState = this.state;
  currentState.weekdays[1] = checked;
  this.setState(currentState)
}

onSelectDaysInputTuesday(event, checked) {
  var currentState = this.state;
  currentState.weekdays[2] = checked;
  this.setState(currentState);
}

onSelectDaysInputWednesday(event, checked) {
  var currentState = this.state;
  currentState.weekdays[3] = checked;
  this.setState(currentState)
}

onSelectDaysInputThursday(event, checked) {
  var currentState = this.state;
  currentState.weekdays[4] = checked;
  this.setState(currentState)
}

onSelectDaysInputFriday(event, checked) {
  var currentState = this.state;
  currentState.weekdays[5] = checked;
  this.setState(currentState)
}

onSelectDaysInputSaturday(event, checked) {
  var currentState = this.state;
  currentState.weekdays[6] = checked;
  this.setState(currentState)
}
//////////////////////////////////////////////////


  render() {
    return (
      <div className="center" >
        <div>
          <AmbitNameInput
            onNameInput={this.onNameInput}
            name={this.state.name}
            />
        </div>
        <div>
          <StartDate
            onStartDateSet={this.onStartDateSet}
            startDate={this.state.startDate}/>
        </div>
        <div>
        <SelectTime
            onSelectTime={this.onSelectTime}/>
        </div>
        <Divider />
        <div>
        <SelectDays
            onSelectDays={this.onSelectDays}
            weekdays={this.state.weekdays}/>
        </div>
        <div>
          <CommitButton
            currentState = {this.state}
            onScheduleAmbit = {this.onScheduleAmbit}/>
        </div>
      </div>
    );
  }
}
