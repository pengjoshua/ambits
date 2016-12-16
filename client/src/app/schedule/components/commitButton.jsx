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
    onTouchTap={props.onSubmitAmbit} // create ambit using date, name etc from current state
    />
    <RaisedButton
    id='toMap'
    label={<Link to='/map'>Cancel</Link>}
    style={style}
    onTouchTap={props.onSubmitAmbit} // create ambit using date, name etc from current state
    />
  </div>
);
}


export default CommitButton;
