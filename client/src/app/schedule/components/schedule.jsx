import React from 'react';
import { Link } from 'react-router'
import DropDownList from './dropdown.jsx';
import CommitButton from './commitButton.jsx';
import StartDate from './startDate.jsx';
import SelectDays from './selectDays.jsx';
import AmbitNameInput from './ambitNameInput.jsx';
import SelectTime from './selectTime.jsx';
import SelectFrequency from './selectFrequency.jsx';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import * as Utils from '../../utils/utils.js';
import {Coords} from '../../map/map.jsx';
import { browserHistory } from 'react-router'

export default class ScheduleContainer extends React.Component {
  constructor (props) {
    super(props);

    if (props.location.state === undefined) {
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
        startTime: null,
        checkIns:[],
        isEditing: false,
        isError: false, // error in validation
        errorMsg: [], // validation error message
        errors: {
          name: false,
          date: false,
          time: false,
          freq: false,
          dateFuture: false
        }
      };
    } else {
      this.state = props.location.state;
      this.state.isEditing = true;
      this.state.isError = false; // error in validation
      this.state.errorMsg = []; // validation error message
      this.state.errors = {
        name: false,
        date: false,
        time: false,
        freq: false,
        dateFuture: false
      };
    }

    this.validateFields = this.validateFields.bind(this);
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
      onSelectDaysInputSelectAll: this.onSelectDaysInputSelectAll.bind(this),
      onSelectDaysInputWeekdays: this.onSelectDaysInputWeekdays.bind(this),
      onSelectDaysInputWeekends: this.onSelectDaysInputWeekends.bind(this),
      onSelectDaysInputMWF: this.onSelectDaysInputMWF.bind(this),
      onSelectDaysInputTR: this.onSelectDaysInputTR.bind(this)
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
    this.validateFields( () => {
      if (!this.state.isError) {
        let ambitState = this.state;
        let ctx = this;
        Utils.postAmbit(ambitState, function(res) {
          console.log('posted!', res);
          browserHistory.replace('/')
        });
      }
    }, false)
  }

  onUpdateAmbit() {
    this.validateFields( () => {
      if (!this.state.isError) {
        let ambitState = this.state;
        Utils.updateAmbit(ambitState, function(res) {
          console.log('Ambit updated!', res);
          browserHistory.replace('/')
        });
      }
    }, true)
  }

  validateFields (cb, edit) {
    let d = new Date();
    let isValid = [
      this.state.name !== '',
      this.state.weekdays.includes(true),
      this.state.startDate !== null,
      this.state.startTime !== null,
      this.state.startDate >= d.setDate(d.getDate() - 1)
    ]

    if (edit) {
      isValid[4] = true;
    }

    if (isValid.includes(false)) {
      let _errorMsg = [];
      isValid[0] ? null : _errorMsg.push('Ambit Name');
      isValid[2] ? null : _errorMsg.push('Ambit Start Date');
      isValid[3] ? null : _errorMsg.push('Ambit Time');
      isValid[1] ? null : _errorMsg.push('Ambit Frequency');
      isValid[4] ? null : _errorMsg.push('Start date should be a present or future date');

      this.setState({
        errorMsg: _errorMsg,
        isError: true,
        errors: {
          name: !isValid[0],
          date: !isValid[2],
          time: !isValid[3],
          freq: !isValid[1],
          dateFuture: !isValid[4]
        }
      }, cb);

    } else {
      this.setState({
        errorMsg: [],
        isError: false,
        errors: {
          name: false,
          date: false,
          time: false,
          freq: false,
          dateFuture: false
        }
      }, cb);
    }
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

      // let currentState = this.state;
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
onSelectDaysInputSelectAll(event, checked) {
  let currentState = this.state;
  currentState.weekdays[0] = checked;
  currentState.weekdays[1] = checked;
  currentState.weekdays[2] = checked;
  currentState.weekdays[3] = checked;
  currentState.weekdays[4] = checked;
  currentState.weekdays[5] = checked;
  currentState.weekdays[6] = checked;
  this.setState(currentState);
}

onSelectDaysInputWeekdays(event, checked) {
  let currentState = this.state;
  currentState.weekdays[1] = checked;
  currentState.weekdays[2] = checked;
  currentState.weekdays[3] = checked;
  currentState.weekdays[4] = checked;
  currentState.weekdays[5] = checked;
  this.setState(currentState);
}

onSelectDaysInputWeekends(event, checked) {
  let currentState = this.state;
  currentState.weekdays[0] = checked;
  currentState.weekdays[6] = checked;
  this.setState(currentState);
}

onSelectDaysInputMWF(event, checked) {
  let currentState = this.state;
  currentState.weekdays[1] = checked;
  currentState.weekdays[3] = checked;
  currentState.weekdays[5] = checked;
  this.setState(currentState);
}

onSelectDaysInputTR(event, checked) {
  let currentState = this.state;
  currentState.weekdays[2] = checked;
  currentState.weekdays[4] = checked;
  this.setState(currentState);
}

onSelectDaysInputSunday(event, checked) {
  let currentState = this.state;
  currentState.weekdays[0] = checked;
  this.setState(currentState);
}

onSelectDaysInputMonday(event, checked) {
  let currentState = this.state;
  currentState.weekdays[1] = checked;
  this.setState(currentState)
}

onSelectDaysInputTuesday(event, checked) {
  let currentState = this.state;
  currentState.weekdays[2] = checked;
  this.setState(currentState);
}

onSelectDaysInputWednesday(event, checked) {
  let currentState = this.state;
  currentState.weekdays[3] = checked;
  this.setState(currentState)
}

onSelectDaysInputThursday(event, checked) {
  let currentState = this.state;
  currentState.weekdays[4] = checked;
  this.setState(currentState)
}

onSelectDaysInputFriday(event, checked) {
  let currentState = this.state;
  currentState.weekdays[5] = checked;
  this.setState(currentState)
}

onSelectDaysInputSaturday(event, checked) {
  let currentState = this.state;
  currentState.weekdays[6] = checked;
  this.setState(currentState)
}

// Handler dialog operations
handleClose () {
  this.setState({
    isError: false
  });
};


//////////////////////////////////////////////////


  render() {
    const windowStyle = {
      marginTop: '64px', // set top bar height
      padding: '15px'
    };

    const frequencyStyle = {
      padding: '20px',
      textAlign: 'center',
      color: 'rgba(0, 0, 0, 0.870588)',
      fontWeight: '500',
    };

    const inputStyle = {
      width: '80%',
      marginLeft: '10%',
      textAlign: 'center',
      marginTop: '-15px'
    };

    const errorStyleLeft = {
      color: 'rgba(0,0,0,0)',
      fontSize: '12px',
      fontWeight: 'normal',
      marginLeft: '5%',
      marginRight: '5%',
    };

    const errorStyleRight = {
      color: 'rgb(244, 67, 54)',
      fontSize: '12px',
      fontWeight: 'normal',
      marginLeft: '5%',
      marginRight: '5%',
    };

    const actions = [
      <RaisedButton
        label='OK'
        onTouchTap={this.handleClose.bind(this)}
        />,
      // <RaisedButton
      //   label={<Link to="/map" >Cancel</Link>}
      //   onTouchTap={this.handleClose.bind(this)}
      //   />
    ];

return (
      <div style={windowStyle}>
        <div>
          <Dialog
            actions={null}
            modal={false}
            open={this.state.isError}
            onRequestClose={this.handleClose.bind(this)}
            >{(
              <div>
                <span>Please complete the fields below before submitting your Ambit</span>
                <ul>
                  {this.state.errorMsg.map((err, i)=>{
                    return (<li key={i}>{err}</li>);
                  })}
                </ul>
              </div>
            )}</Dialog>
        </div>
        <div style={inputStyle}>
          <AmbitNameInput
            errorCheck={this.state.errors.name}
            onNameInput={this.onNameInput}
            name={this.state.name}
            />
        </div>
        <div style={inputStyle}>
          <StartDate
            errorCheck={this.state.errors.date}
            errorCheckFuture={this.state.errors.dateFuture}
            onStartDateSet={this.onStartDateSet}
            startDate={this.state.startDate}/>
        </div>
        <div style={inputStyle}>
          <SelectTime
            errorCheck={this.state.errors.time}
            onSelectTime={this.onSelectTime}
            startTime={this.state.startTime}
          />
        </div>
        <Divider style={{margin: '10px 0'}} />
        <div style={frequencyStyle}>
        {this.state.errors.freq ? <span style={errorStyleLeft}>required</span> : null}
        <span style={{fontSize:'18px'}}>Ambit Frequency</span>
        {this.state.errors.freq ? <span style={errorStyleRight}>required</span> : null}
          <SelectDays
            onSelectDays={this.onSelectDays}
            weekdays={this.state.weekdays}/>
        </div>
        <div>
          <CommitButton
            currentState = {this.state}
            onSubmitAmbit = {this.state.isEditing ? this.onUpdateAmbit.bind(this) : this.onScheduleAmbit.bind(this)}/>
        </div>
      </div>
    );
  }
}
