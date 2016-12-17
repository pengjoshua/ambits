import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import {Link} from 'react-router';
import {nextOccurance} from '../../utils/utils.js';
import moment from 'moment';
import AttendanceStats from './attendanceStats.jsx'

const notCheckedStyle = {
  color: 'white', //TODO: not working colors...
  rippleColor: 'green',
  backgroundColor:'green',
};

const checkedStyle = {
  color: 'white',
  backgroundColor:'blue',
};

const statsStyle = {
  color: 'white',
  backgroundColor:'red',
};

const deleteStyle = {
  color: 'white',
  backgroundColor:'red',
};

const cardStyle = {
  'margin': '10px'
};

const editStyle = {
  color: 'white',
  backgroundColor:'blue',
};

const linkStyle = {
  color:'white',
  'textDecoration':'none'
};


class Ambit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ambit: this.props.ambit,
      showStats: false,
    };
  }

  statsClick() {
    this.setState({showStats: !this.state.showStats});
  }


  render () {
    return (
      <tag>
        <Card style={cardStyle}>
          <CardHeader
            title = {this.props.ambit.name}
            avatar ={'https://dummyimage.com/100x100/000/fff&text=' + this.props.ambit.name[0].toUpperCase()}
            subtitle = {this.props.ambit.frequency}
          />
          <CardTitle
            title = { nextOccurance(this.props.ambit).toLocaleTimeString()
            }
            subtitle = {
            moment(nextOccurance(this.props.ambit)).fromNow()
            }
          />
          <CardActions>
            <FlatButton
              label= {
                this.props.ambit.checkedIn ? "Checked In":"Check In!"
              }
              onTouchTap={() => {
                this.props.handleCheckinAmbit(this.props.ambit);
                }
              }
              disabled = {this.props.ambit.checkedIn}
              style={this.props.ambit.checkedIn ? checkedStyle : notCheckedStyle}
            />
            <FlatButton
              label={<Link to={{pathname: '/schedule', state: this.props.ambit}} style={linkStyle}>Edit</Link>}//send to the stats page of the ambit.
              style={editStyle}
            />
            <FlatButton
              onClick = {this.statsClick.bind(this)}
              label='Stats'//send to the stats page of the ambit.
              style={statsStyle}
            />
            <FlatButton
              label={'Delete'}
              onTouchTap={() =>
                this.props.handleDeleteAmbit(this.props.ambit)}
              style={deleteStyle}
            />
           {this.state.showStats ? <AttendanceStats ambit = {this.props.ambit}/> : null}
          </CardActions>
        </Card>
      </tag>
    );
  }
};


Ambit.propTypes = {
  ambit: React.PropTypes.object.isRequired,
  handleCheckinAmbit: React.PropTypes.func.isRequired
};

export default Ambit;
