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
import TextField from 'material-ui/TextField';
import Login from './login/login.jsx';
import * as loginCtrl from './login/loginCtrl';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
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
      username: ''
    };
  }


  handleLogout() {
    let newAmbits = this.state.ambits;
    loginCtrl.logout();
    this.setState({
      isLoggedIn: false
    });
  }

  render() {
    const logOutButton = this.state.isLoggedIn ?
      (<FlatButton label="Logout"
        onTouchTap={this.handleLogout.bind(this)}
       />
      ) :
      null;
    const LoginModal = !this.state.isLoggedIn ?
      (<Login main={this} />) :
      null;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar
            title='Ambitually'
            iconElementRight={logOutButton}
          />
          {LoginModal}
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
