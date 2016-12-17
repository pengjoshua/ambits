import React from 'react';
import TextField from 'material-ui/TextField';


const centerStyle = {
  width: '100%',
  textAlign: 'center'
}

const leftStyle = {
  textAlign: 'left'
}

const AmbitNameInput = (props) => (
  <div>
    <TextField
      defaultValue={ props.name || '' }
      hintStyle={centerStyle}
      floatingLabelStyle={leftStyle}
      floatingLabelFocusStyle={leftStyle}
      inputStyle={centerStyle}
      errorStyle={centerStyle}
      fullWidth={true}
      errorText={(props.errorcheck) ? 'required' : ''}
      hintText= "Enter Ambit Name"
      floatingLabelText= "Ambit Name"
      onChange={props.onNameInput}
    />
  </div>
);

export default AmbitNameInput;
