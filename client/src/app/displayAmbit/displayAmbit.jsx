import React from 'react';

import {List, ListItem} from 'material-ui/List';
import * as Utils from '../utils/utils.js';

export default class displayAmbit extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      today: new Date(),

      //hardcoded data for mock-up purposes
      ambit: {weekdays: [true,true,false,true,false,true,true]}, //mon, wed, fri, sat, sun
      log: {"Sat Dec 10 2016": true, "Mon Dec 12 2016": true}
    }
  }

  dateInLog(date){
    if (this.state.log[date.toDateString()]){
      return true;
    } else {
      return false;
    }
  }

  render() {
    var startDate = new Date(this.state.today.toDateString());
    startDate.setDate(startDate.getDate() - 3);
    var dates = [];
    for (var i = 0; i < 7; i++){
      var itemInfo = {};
      var itemDate = new Date(startDate);
      itemDate.setDate(itemDate.getDate() + i);

      itemInfo.date = itemDate;

      //if this list item's day of the week doesn't match ambit.weekdays
      console.log(itemDate.getDay);
      if(this.state.ambit.weekdays[itemDate.getDay()] === false){
        itemInfo.status = 'Free';
      }
      else{
        //if this item's day matches weekdays,
        //and there is a check-in in the log for this date
        if (this.dateInLog(itemDate)){
          itemInfo.status = 'Accomplished';
        } else {
          //if there's no check-in and the item is for after today
          if (itemDate > this.state.today){
            itemInfo.status = 'Committed';
          } else{
            //if there's no check-in and the item is from before today
            itemInfo.status = 'Failed';
          }
        }
      }
      dates.push(itemInfo);
    }
    var listItems = dates.map(function(info){
      // TODO: set unique key on children
      return(
        <ListItem primaryText={info.status} secondaryText={info.date.toDateString()}/>
      )
    });

    return(
      <List>
        {listItems}
      </List>
    );
  }
}
