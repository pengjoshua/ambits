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
  margin: '10px',
  paddingTop: '-10px'
};

const editStyle = {
  color: 'white',
  backgroundColor:'blue',
};

const linkStyle = {
  color:'white',
  textDecoration:'none'
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

  decorateDate() {
    let dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    let timeOptions = {
      hour12: true,
      hour: 'numeric',
      minute: 'numeric'
    };
    let rawDate = new Date(nextOccurrence(this.props.ambit).toLocaleString());
    let tomorrow = new Date();
    tomorrow.setDate(((new Date()).getDate() + 1));
    let today = new Date().toLocaleDateString();
    tomorrow = tomorrow.toLocaleDateString();
    let ambitDate = rawDate.toLocaleDateString();

    let soonText = '';
    if (ambitDate === today) {
      soonText = 'today';
    } else if (ambitDate === tomorrow) {
      soonText = 'tomorrow';
    } else {
      soonText = '';
    }

    return (<div>
              <span>{rawDate.toLocaleDateString('en-US', dateOptions)}</span><br></br>
              <span>{'@ ' + rawDate.toLocaleTimeString('en-US', timeOptions)}</span><small className='soonText'>{soonText}</small>
            </div>);
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
      <div className='nextOccurrence'>
        <span>Next Occurance</span>
      </div>
        <CardTitle
          title = {this.decorateDate()}
          subtitle = {moment(nextOccurrence(this.props.ambit)).fromNow()}
          style={{paddingTop: '0'}}
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

Ambit.propTypes = {
  ambit: React.PropTypes.object.isRequired,
  handleCheckinAmbit: React.PropTypes.func.isRequired
};

export default Ambit;
