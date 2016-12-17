import React from 'react';
import {Bar} from 'react-chartjs';

class AttendanceStats extends React.Component {


  render() {
    if(this.props.ambit.made.reduce((a,b) => a+b) ||
      this.props.ambit.missed.reduce((a,b) => a+b)) {
      return (
        <div>
          Stats
        </div>
      )
      
    } else {
      return (
        <div>
          Nothing Here!
        </div>
      )
    }
  }
}

AttendanceStats.propTypes = {
  ambit: React.PropTypes.object.isRequired,
  handleCheckinAmbit: React.PropTypes.func.isRequired
};

export default AttendanceStats;