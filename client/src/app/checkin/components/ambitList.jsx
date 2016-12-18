import React from 'react';
import Ambit from './ambit.jsx';
import {nextOccurrence} from '../../utils/utils.js'
import {Card, CardHeader} from 'material-ui/Card';
import TextField from 'material-ui/TextField';


const cardStyle = {
  margin: '10px',
  height: '70px',
};

const textStyle = {
  paddingLeft: '30px',
  position: 'relative',
  top: '0',
};

const inputStyle = {
  display: 'inline-block',
  margin: '-10px 0 0 0 ',
  textAlign: 'center',
  right: '5px',
  left: '12px',
  width: '80%'
};

const iconStyle = {
  margin: '10px 0 0 10px',
}

const windowStyle = {
  marginTop: '74px', // set top bar height (10px spacing)
  marginBottom: '52px' // set bottom button height (10px spacing)
};

// <CardHeader
//   avatar={<i className="material-icons">search</i>}
//   title={<input id='searchFilter' type='text' onChange={(e) => props.filterAmbits(e)} placeholder='Search'></input>}
//   />

const AmbitList = (props) => {

  return (<div className='ambitList' style={windowStyle}>
  <Card style={cardStyle}>
    avatar={<i style={iconStyle} className="material-icons">search</i>}
    <TextField
      hintText='Search'
      style={inputStyle}
      floatingLabelText= "Search"
      onChange={(e) => props.filterAmbits(e)}
    />
  </Card>



  {
    props.ambits
    .sort((a, b) => {
      return nextOccurrence(a) - nextOccurrence(b);
    })
    .map((item, i) =>
      (<Ambit ambit={item} key={i} handleCheckinAmbit={props.handleCheckinAmbit}
      handleDeleteAmbit={props.handleDeleteAmbit}
      />))
  }
  </div>);
}

AmbitList.propTypes = {
  ambits: React.PropTypes.array.isRequired,
  handleCheckinAmbit: React.PropTypes.func.isRequired
};

export default AmbitList;
