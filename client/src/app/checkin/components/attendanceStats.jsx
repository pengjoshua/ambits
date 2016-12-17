import React from 'react';
import {Bar} from 'react-chartjs';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

class AttendanceStats extends React.Component {

  render() {
    var statsBuild = function(ambit) {
      var data = {
        labels: [],
        datasets: [{
          label: 'Missed',
          data:[],
          fillColor: "rgb(255, 0, 0)",
          strokeColor: "rgba(220,220,220,0.8)",
          highlightFill: "rgba(220,220,220,0.75)",
          highlightStroke: "rgba(220,220,220,1)",
        }, {
          label: 'Made',
          data:[],
          fillColor: "rgb(0, 188, 212)",
          strokeColor: "rgba(220,220,220,0.8)",
          highlightFill: "rgb(0, 188, 212)",
          highlightStroke: "rgba(220,220,220,1)",
        }],
      };
      ambit.weekdays.forEach((day, index = 0) => {
        if(day) {
          data.labels.push(days[index]);
          data.datasets[0].data.push(ambit.missed[index]);
          data.datasets[1].data.push(ambit.made[index])
        }
        index++;
      })
      return data;
    }




    if(this.props.ambit.made.reduce((a,b) => a+b) ||
      this.props.ambit.missed.reduce((a,b) => a+b)) {
      return (
        <div>
          <Bar data = {statsBuild(this.props.ambit)} />
        </div>
      )
      
    } else {
      return (
        <div>
          No stats yet, sorry!
        </div>
      )
    }
  }
}

AttendanceStats.propTypes = {
  ambit: React.PropTypes.object.isRequired,
};

export default AttendanceStats;