import React from 'react';
import Ambit from './ambit.jsx';

const AmbitList = (props) => {
  const windowStyle = {
    marginTop: '74px', // set top bar height (10px spacing)
    marginBottom: '52px', // set bottom button height (10px spacing)
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
