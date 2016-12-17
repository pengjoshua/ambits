import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';

const style = {
  minWidth: '70%'
};

const btnStyle = {
  bottom: '0',
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
        onTouchTap={props.onSubmitAmbit}
        />
    </div>
    <div style={splitStyle}>
      <RaisedButton
        id='toMap'
        label={<Link to='/map'>Cancel</Link>}
        style={style}
        />
    </div>
  </div>
);
}


export default CommitButton;
