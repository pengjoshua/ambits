import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';

const style = {
  margin: 12
};

const CommitButton = (props) => {

 return (
  <div>
    <RaisedButton
    id='toHome'
    label={<Link to='/'>Commit</Link>}
    style={style}
    onTouchTap={props.onSubmitAmbit}
    />
    <RaisedButton
    id='toMap'
    label={<Link to='/map'>Cancel</Link>}
    style={style}
    />
  </div>
);
}


export default CommitButton;
