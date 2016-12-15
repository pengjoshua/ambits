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
    id='home'
    label={<Link to='/'>Commit</Link>}
    style={style}
    onTouchTap={props.onSubmitAmbit} // create ambit using date, name etc from current state
    />
    <RaisedButton
    label={<Link to='/display'>Schedule and Return to Display</Link>}
    style={style}
    onTouchTap={props.onSubmitAmbit} // create ambit using date, name etc from current state
    />
  </div>
);
}


export default CommitButton;
