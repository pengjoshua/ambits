import React from 'react';
import Ambit from './ambit.jsx';

const AmbitList = (props) => {
  const windowStyle = {
    marginTop: '64px', // set top bar height
    marginBottom: '42px', // set bottom button height
  };

  return (<div className='ambitList' style={windowStyle}>
  {
    props.ambits.map((item, i) =>
      (<Ambit ambit={item} key={i} handleCheckinAmbit={props.handleCheckinAmbit}/>))
  }
  </div>);
}

AmbitList.propTypes = {
  ambits: React.PropTypes.array.isRequired,
  handleCheckinAmbit: React.PropTypes.func.isRequired
};

export default AmbitList;
