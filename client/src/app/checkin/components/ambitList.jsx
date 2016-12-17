import React from 'react';
import Ambit from './ambit.jsx';
import {nextOccurrence} from '../../utils/utils.js'
import {Card, CardHeader} from 'material-ui/Card';


const cardStyle = {
  'margin': '10px'
};

const AmbitList = (props) => {
  const windowStyle = {
    marginTop: '74px', // set top bar height (10px spacing)
    marginBottom: '52px', // set bottom button height (10px spacing)
  };

  return (<div className='ambitList' style={windowStyle}>
  <Card style={cardStyle}>
    <CardHeader
      title = {<input id='searchFilter' type='text' onChange={(e) => props.filterAmbits(e)} placeholder='Search'></input>}
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
