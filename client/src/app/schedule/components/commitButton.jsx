import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';

const style = {
  minWidth: '70%',
};

const linkStyle = {
  color: 'rgba(0, 0, 0, 0.870588)',
  textDecoration: 'none'
};

const btnStyle = {
  width: '100%',
  alignItems: 'center',
};

const splitStyle = {
  marginTop: '20px',
  minWidth: '50%',
  textAlign: 'center',
  display: 'inline-block'
};

const CommitButton = (props) => {

 return (
  <div style={btnStyle}>
    <div style={splitStyle}>
      <RaisedButton
        id='toHome'
        label='Commit'
        style={style}
        labelStyle={linkStyle}
        onTouchTap={props.onSubmitAmbit}
        />
    </div>
    <div style={splitStyle}>
      <RaisedButton
        id='toMap'
        label={<Link style={linkStyle} to='/map'>Cancel</Link>}
        style={style}
        />
    </div>
  </div>
);
}


export default CommitButton;
