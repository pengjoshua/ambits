import React from 'react';
import Ambit from './ambit.jsx';
import {nextOccurrence} from '../../utils/utils.js'

const AmbitList = (props) => {
  const windowStyle = {
    marginTop: '74px', // set top bar height (10px spacing)
    marginBottom: '52px', // set bottom button height (10px spacing)
  };

  return (<div className='ambitList' style={windowStyle}>
  {
    props.ambits.map((item, i) =>
      (<Ambit ambit={item} key={i} handleCheckinAmbit={props.handleCheckinAmbit}
      handleDeleteAmbit={props.handleDeleteAmbit}
      />)).sort((a, b) => {
        return nextOccurrence(a.props.ambit) - nextOccurrence(b.props.ambit);
      })
  }
  </div>);
}

AmbitList.propTypes = {
  ambits: React.PropTypes.array.isRequired,
  handleCheckinAmbit: React.PropTypes.func.isRequired
};

export default AmbitList;
