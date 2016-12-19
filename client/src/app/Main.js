/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Login from './login/login.jsx';
import * as loginCtrl from './login/loginCtrl';
require('../www/favicon.ico'); //Tell webpack to load favicon.ico
import { Link } from 'react-router'

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: '200px',
  },
};

const titleStyle = {
  textDecoration: 'none',
  color: 'white'
}

const appBarStyle = {
  position: 'fixed',
  top: '0',
};

const linkStyle = {
  color: 'rgba(0, 0, 0, 0.870588)',
  textDecoration: 'none'
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class Main extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoggedIn: !!loginCtrl.getJwt(),
      username: '',
      open: false
    };
  }

  setUsername(username) {
    this.setState({ username });
  }

  handleLogout() {
    let newAmbits = this.state.ambits;
    loginCtrl.logout();
    this.setState({
      isLoggedIn: false,
      username: ''
    });
  }

  handleDrawerToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  render() {
    const usernameIcon = this.state.isLoggedIn ?
      (<FlatButton disabled={true} label={this.state.username || ' '} style={this.mainStyle}/>) : null;
    const LoginModal = !this.state.isLoggedIn ?
      (<Login main={this} style={this.mainStyle}/>) :
      null;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar
            title={<Link to="/" style={titleStyle}>Ambitually</Link>}
            style={appBarStyle}
            onLeftIconButtonTouchTap={this.handleDrawerToggle}
            iconElementRight={usernameIcon}
          />
          <Drawer
            docked={false}
            width={100}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
          >
            <Link to="/" style={linkStyle} onClick={this.handleDrawerToggle}><MenuItem>Home</MenuItem></Link>
            <Link to='/display' style={linkStyle} onClick={this.handleDrawerToggle}><MenuItem>Statistics</MenuItem></Link>
            <Link to='/map' style={linkStyle} onClick={this.handleDrawerToggle}><MenuItem>Map</MenuItem></Link>
            <Link to='/' style={linkStyle} onClick={(e)=>{this.handleDrawerToggle();this.handleLogout.call(this)}}><MenuItem>Logout</MenuItem></Link>
          </Drawer>
          {LoginModal}
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
