import React from 'react';
import Ambit from './ambit.jsx';
import {nextOccurance} from '../../utils/utils.js'

const AmbitList = (props) => {
  return (<div className='ambitList'>
  {
    props.ambits.map((item, i) =>
      (<Ambit ambit={item} key={i} handleCheckinAmbit={props.handleCheckinAmbit}
      handleDeleteAmbit={props.handleDeleteAmbit}
      />)).sort((a, b) => {
        return nextOccurance(a.props.ambit) - nextOccurance(b.props.ambit);
      })
  }
  </div>);
}

AmbitList.propTypes = {
  ambits: React.PropTypes.array.isRequired,
  handleCheckinAmbit: React.PropTypes.func.isRequired
};

export default AmbitList;
