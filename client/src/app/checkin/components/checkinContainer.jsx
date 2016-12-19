import React from 'react';
import * as Utils from '../../utils/utils.js';
import AmbitList from './ambitList.jsx';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import {Router, Route, Link} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
//import Controls from './controls.jsx';
import {deleteAmbit} from '../../utils/utils.js'

// styling
const buttonStyle = {
  color: 'white',
  backgroundColor:'orange',
  position: 'fixed',
  bottom: '0',
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  }
});

const createStyle = {
  color: 'white',
  backgroundColor:'orange',
  'marginTop': '6px'
};


const spinnerStyle  = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
};

const userFeedback = {
  default: '',
  cheat:'Not at the Location',
  geoNotFount: 'Geolocation feature is not enabled',
  successfulCheckin: 'Check in successful',
  duplicateCheckin: 'You already checked in',
  checkInternetConnection:'Cannot fetch ambits:( Check internet connection',
  notTimeYet: 'You can only check in 15 minutes before Ambit'
};


export default class CheckinContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ambits: [],
      loading: false,
      feedback: {
        open: false,
        message: userFeedback.default
      },
      filteredAmbitList: null
    };
    this.handleCheckinAmbit = this.handleCheckinAmbit.bind(this);
  }
  componentDidMount() {
    Utils.getAllAmbits((data, error) => {
      if(error) {
        //send user feedback: no connection
      } else {
        this.setState({ambits: data});
      }
    });
  }

  componentWillReceiveProps() {
    this.getAmbits()
  }

  getAmbits() {
    Utils.getAllAmbits((data) => {
      this.setState({
        ambits: data
      });
    });
  }

  handleDeleteAmbit(ambit) {
    deleteAmbit(ambit, (res, err) => {
      if (err) {
        console.log('Failed to delete ambit', err);
      } else {
        console.log('Ambit deleted', res);
      }
    });
    this.getAmbits();
  }

  handleCheckinAmbit(ambit, isCheckedIn) {
    this.setState({loading: true}); //loading...
    if (isCheckedIn) {
      this.setState({
        loading: false,
        ambits: this.state.ambits,
        feedback: {
          open: true,
          message: userFeedback.duplicateCheckin
        }
      });
    } else {
      //validate checkin:
      Utils.checkinAmbit(ambit, () => {
        //if valid update the state
        let now = new Date();
        let nextDate = new Date(Utils.nextOccurrence(ambit));
        let lagTime = 15; // minutes before next occurance in which to allow checkin
        let lagDateBefore = new Date(nextDate - lagTime * 60000);
        if (lagDateBefore < now || nextDate < now) {
          this.state.ambits.find(item => ambit.name === item.name).checkedIn = true;
          this.setState({
            loading: false,
            ambits: this.state.ambits,
            feedback: {
              open: true,
              message: userFeedback.successfulCheckin
            }
          });
          //update the database
          Utils.postCheckin(ambit.refId, () => {
            console.log('delivered');
          }, function(err) {
            console.log('err', err);
          });
        } else {
          this.setState({
            loading:false,
            feedback: {open: true, message: userFeedback.notTimeYet}
          });
        }
      }, ()=>{
        //you can't cheat message:
        this.setState({loading:false, feedback: { open: true, message:userFeedback.cheat}});
      });
    }
  }

  filterAmbits(e) {
    let filterText = e.target.value;
    let filteredAmbits = this.state.ambits
      .filter((ambit) => {

      if (filterText === undefined || filterText === '') {
        return true;
      } else if (ambit) {
        return ambit.name.toLowerCase().includes(filterText.toLowerCase());
      }
    });
    this.setState({
      filteredAmbitList: filteredAmbits
    });
  }

  handleShowStats(){}

  render() {
    if(!this.state.loading) {
      return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <AmbitList
              filterText={this.state.filterText}
              ambits={this.state.filteredAmbitList || this.state.ambits}
            handleCheckinAmbit={this.handleCheckinAmbit}
            handleDeleteAmbit={this.handleDeleteAmbit.bind(this)}
            filterAmbits={this.filterAmbits.bind(this)}/>

            <RaisedButton
            onTouchTap={this.handleCreateAmbit}
            buttonStyle={createStyle}
            containerElement={<Link to='/map'/>}
            fullWidth = {true}
            style={buttonStyle}
            >Create Ambit</RaisedButton>

            <Snackbar
            open={this.state.feedback.open}
            message={this.state.feedback.message}
            autoHideDuration={2000}
            />
          </div>
        </MuiThemeProvider>
      );
    } else {
      return (
        <div>
          <CircularProgress size={60} thickness={7} style={spinnerStyle}/>
        </div>
        );
    }
  }
};

// /<Controls handleCreateAmbit={this.handleCreateAmbit}/>
