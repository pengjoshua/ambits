import React from 'react';
import Ambit from './ambit.jsx';

const AmbitList = (props) => {
  return (<div className='ambitList'>
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
