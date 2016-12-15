import FlatButton from 'material-ui/FlatButton';

export default const Controls = (props) => {
  return (<div>
   <FlatButton onTouchTap={props.handleCreateAmbit}>Create Ambit</FlatButton>
    </div>);
};
