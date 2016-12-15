import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';

const style = {
  margin: 12
};

const CommitButton = (props) => (
  <div>
    <RaisedButton
    id='home'
    label={<Link to='/'>Commit</Link>}
    style={style}
    onTouchTap={props.onScheduleAmbit} // create ambit using date, name etc from current state
    />
  </div>
);


export default CommitButton;
