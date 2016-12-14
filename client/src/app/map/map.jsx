import React, { Component } from 'react';
import loadGoogleMapsAPI from 'load-google-maps-api';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';
import MarkerClusterer from 'node-js-marker-clusterer';
import * as Utils from '../utils/utils.js';
import Promise from 'bluebird';

const actionStyle = {
  color: 'white',
  backgroundColor:'purple',
  position: 'fixed',
  top: '80%',
  left: '50%',
  height:'50px',
  width:'240px',
  transform: 'translate(-50%, -50%)'
};

const showMarkersStyle = {
  color: 'white',
  backgroundColor:'purple',
  position: 'fixed',
  top: '85%',
  left: '50%',
  height:'50px',
  width:'240px',
  transform: 'translate(-50%, -50%)'
};

const hideMarkersStyle = {
  color: 'white',
  backgroundColor:'purple',
  position: 'fixed',
  top: '90%',
  left: '50%',
  height:'50px',
  width:'240px',
  transform: 'translate(-50%, -50%)'
};

const linkStyle = {
  color:'white',
  'textDecoration':'none'
};

var Coords = {
  latitude: 0,
  longitude: 0
};

class Map extends Component {
  constructor(props, context) {
    super(props, context);

    this.markers = [];
    this.ambits = [];
    this.mapInstance = {};
    this.googleMaps = {};
    this.centerMarker = {};
  }

  componentWillMount() {
    Utils.getAllAmbits((res) => {
      this.ambits = this.ambits.concat(res);
      console.log('ambits', this.ambits);
    });
  }
  
  componentDidMount() {
    loadGoogleMapsAPI({
      key: "AIzaSyAHJfNJp8pbRxf_05L1TIm5ru-Dvcla-Nw",
      v: '3.25'
    }).then((googleMaps) => {
      this.initMap(googleMaps);
      var map = this.mapInstance; // new instance of googleMaps

      // googleMaps.event.addListener(map, 'drag', () => {
      //   var centerLatLng = map.getCenter();
      //   this.centerMarker.setPosition(centerLatLng);
      // });

    });
  }

  initMap(googleMaps) {
    var hackReactor = { lat: 37.791066, lng: -122.3991683 };
    var map = new googleMaps.Map(document.getElementById('map'), {
      zoom: 15,
      center: hackReactor
    });

    var largeInfowindow = new googleMaps.InfoWindow();
    var bounds = new googleMaps.LatLngBounds();

    for (var i = 0; i < this.ambits.length; i++) {
      var location = {};
      location.lat = this.ambits[i].coords.latitude;
      location.lng = this.ambits[i].coords.longitude;
      var position = location;
      var title = this.ambits[i].name;
      var marker = new googleMaps.Marker({
        map: map,
        position: position,
        title: title,
        animation: googleMaps.Animation.DROP,
        draggable: true,
        id: i
      });
      this.markers.push(marker);

      var context = this;
      marker.addListener('click', function() {
        context.populateInfoWindow(this, largeInfowindow);
      });
      bounds.extend(this.markers[i].position);
    }
    map.fitBounds(bounds);

    this.mapInstance = map;
    this.centerMarker = marker;
    this.googleMaps = googleMaps;
  }

  getCoordinates() {
    Coords = {
      latitude: this.mapInstance.getCenter().lat(),
      longitude: this.mapInstance.getCenter().lng()
    };
    console.log(Coords);
  }

  populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(this.mapInstance, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', () => {
        infowindow.setMarker(null);
      });
    }
  }

  showMarkers() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(this.mapInstance);
      bounds.extend(this.markers[i].position);
    }
    this.mapInstance.fitBounds(bounds);
  }

  // This function will loop through the markers and hide them all.
  hideMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
  }

  render() {
    return (
      <div className="container">
        <div className="options-box">
        <h1>Schedule A New Ambit</h1>
          <div>
          </div>
        </div>
        <div id="map"></div> 
          <RaisedButton 
            onTouchTap={this.getCoordinates.bind(this)}   
            label={<Link to='/schedule' style={linkStyle}>Schedule for this Location</Link> }
            buttonStyle={actionStyle}
            primary = {true}
            // containerElement={<Link to='/schedule'/>}
            fullWidth={false}
          ></RaisedButton>
          <RaisedButton 
            onTouchTap={this.showMarkers.bind(this)}   
            label="show markers"
            buttonStyle={showMarkersStyle}
            primary = {true}
            fullWidth={false}
          ></RaisedButton>
          <RaisedButton 
            onTouchTap={this.hideMarkers.bind(this)}   
            label="hide markers"
            buttonStyle={hideMarkersStyle}
            primary = {true}
            fullWidth={false}
          ></RaisedButton>
      </div>
    )
  }
}

export { Coords }; //there is single-entry point to schedule and it is through maps.
export default Map;
