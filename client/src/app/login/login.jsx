import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import * as loginCtrl from './loginCtrl';
import axios from 'axios';

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      password: '',
      loginIsOpen: true,
      isSigningUp: false,
      submitError: ''
    };
  };

  componentDidMount() {
    document.title = "Login";
  }

  handleLogin = () => {
    var returningUser = {
      email: this.state.email.toLowerCase(),
      password: this.state.password
    };
    loginCtrl.login(returningUser)
    .then(res => {
      this.setState({
        loginIsOpen: false
      })
      this.props.main.setState({
        isLoggedIn: true,
        username: res.data.username
      });
    })
    .catch(err => {
      const msg = err.response.data.message;
      this.setState({
        submitError: msg
      });
    })
  };

  handleSignUp = () => {
    var newUser = {
      email: this.state.email.toLowerCase(),
      username: this.state.username,
      password: this.state.password
    };
    loginCtrl.signup(newUser)
    .then(res => {
      this.setState({
        loginIsOpen: false
      });
      this.props.main.setState({
        isLoggedIn: true,
        username: res.data.username
      });
    })
    .catch(err => {
      const msg = err.response.data.message;
      this.setState({
        submitError: msg
      });
    })
  };

  handleChange = (name, e) => {
    if (this.state.submitError) {
      this.setState({ submitError: '' });
    }
    if (name === 'email') {
      this.setState({
        [name]: e.target.value.toUpperCase()
      });
    } else {
      this.setState({
        [name]: e.target.value
      });
    }
  };

  toggleSignUp = () => {
    this.setState({
      isSigningUp: !this.state.isSigningUp
    });
  };

  render() {
    const signUp = this.state.isSigningUp;
    const signUpField = signUp ?
      (<TextField
        className='signUpUsername'
        onChange={this.handleChange.bind(this,'username')}
        fullWidth={true}
        hintText='username' />) :
      null;

    const standardActions = [
      <RaisedButton
        className='login'
        label='Login'
        primary={!this.state.isSigningUp}
        onTouchTap={(!signUp) ?
          this.handleLogin :
          this.toggleSignUp.bind(this)
        }
      />,
      <RaisedButton
        className='signup'
        label='Signup'
        primary={this.state.isSigningUp}
        onTouchTap={(signUp) ?
          this.handleSignUp :
          this.toggleSignUp.bind(this)
        }
      />
    ];

    return (
          <Dialog
            autoDetectWindowHeight={false}
            overlayClassName='hidden'
            overlayStyle={{backgroundColor: '#fff'}}
            open={this.state.loginIsOpen}
            title={'Welcome to Ambitually!'}
            titleStyle={{textAlign: 'center'}}
            actions={standardActions}
            modal={true}
            actionsContainerStyle={{textAlign: 'center'}}
          >
            <TextField
              className='signUpEmail'
              onChange={this.handleChange.bind(this,'email')}
              fullWidth={true}
              hintText='email' />
            {signUpField}
            <TextField
              className='signUpPassword'
              onChange={this.handleChange.bind(this,'password')}
              fullWidth={true}
              hintText='password'
              type='password'
              errorText={this.state.submitError}
             />
          </Dialog>
    );
  }
}

export default Login;
