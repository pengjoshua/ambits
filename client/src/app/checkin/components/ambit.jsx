import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import {Link} from 'react-router';
import AttendanceStats from './attendanceStats.jsx'
import {nextOccurrence} from '../../utils/utils.js'
import moment from 'moment'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

const multilineChartIcon = <i className="material-icons">multiline_chart</i>;
const editIcon = <i className="material-icons">edit</i>;
const doneIcon = <i className="material-icons">done</i>;
const touchAppIcon = <i className="material-icons">touch_app</i>;
const clearIcon = <i className="material-icons">clear</i>;

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
      selectedIndex: null,
      ambit: this.props.ambit,
      showStats: false,
    };
  }

  select (index) {
    this.setState({selectedIndex: index});
    if (index === 0) {
      this.props.handleCheckinAmbit(this.props.ambit);
    } else if (index === 1) {

    } else if (index === 2) {
      this.statsClick();
    } else if (index === 3) {
      this.props.handleDeleteAmbit(this.props.ambit).bind(this);
    } else {

    }
  };

  statsClick() {
    this.setState({showStats: !this.state.showStats});
  }


  render () {
    return (

      <Card style={cardStyle}>
        <CardHeader
          title = {this.props.ambit.name}
          avatar ={'https://dummyimage.com/100x100/' +
            /* background color */ '#000'.slice(1) + '/' +
            /* text color */ '#ffffff'.slice(1) +
            '&text=' +
            /* pull first letter */ this.props.ambit.name[0].toUpperCase()}
          subtitle = {this.props.ambit.frequency}
        />
        <CardTitle
          title = { nextOccurrence(this.props.ambit).toLocaleString()
          }
          subtitle = {

          moment(nextOccurrence(this.props.ambit)).fromNow()
          }
        />
      {this.state.showStats ? <AttendanceStats ambit={this.props.ambit} /> : null}
        <CardActions>
          <Paper zDepth={1}>
            <BottomNavigation selectedIndex={this.state.selectedIndex}>
              {this.props.ambit.checkedIn ? (
            <Link>
              <BottomNavigationItem
                className="nav"
                label="Checked in"
                icon={doneIcon}
                onTouchTap={() => this.select(0)}
              />
            </Link>
          ) : (
            <Link>
              <BottomNavigationItem
                className="nav"
                label="Check in"
                icon={touchAppIcon}
                onTouchTap={() => this.select(0)}
              />
            </Link>
          )}
            <Link to={{pathname: '/schedule', state: this.props.ambit}} style={linkStyle}>
              <BottomNavigationItem
                className="nav"
                label="Edit"
                icon={editIcon}
                onTouchTap={() => this.select(1)}
              />
            </Link>
            <Link>
              <BottomNavigationItem
                className="nav"
                label="Stats"
                icon={multilineChartIcon}
                onTouchTap={() => this.select(2)}
              />
            </Link>
            <Link>
              <BottomNavigationItem
                className="nav"
                label="Delete"
                icon={clearIcon}
                onTouchTap={() => this.select(3)}
              />
            </Link>
            </BottomNavigation>
          </Paper>
          </CardActions>
        </Card>
    );
  }
};

// <FlatButton
//   label= {this.props.ambit.checkedIn ? "Checked In":"Check In"}
//   onTouchTap={() => {this.props.handleCheckinAmbit(this.props.ambit)}}
//   disabled={this.props.ambit.checkedIn}
//   style={this.props.ambit.checkedIn ? checkedStyle : notCheckedStyle}
// />
// <FlatButton
//   label={<Link to={{pathname: '/schedule', state: this.props.ambit}} style={linkStyle}>Edit</Link>}
//   style={editStyle}
// />
// <FlatButton
//   onClick = {this.statsClick.bind(this)}
//   label='Stats'
//   style={statsStyle}
// />
// <FlatButton
//   label={'Delete'}
//   onTouchTap={() => this.props.handleDeleteAmbit(this.props.ambit)}
//   style={deleteStyle}
// />

Ambit.propTypes = {
  ambit: React.PropTypes.object.isRequired,
  handleCheckinAmbit: React.PropTypes.func.isRequired
};

export default Ambit;
