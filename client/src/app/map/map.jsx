import React, { Component } from 'react';
import loadGoogleMapsAPI from 'load-google-maps-api';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';
import MarkerClusterer from 'node-js-marker-clusterer';
import * as Utils from '../utils/utils.js';
import * as Colors from '../../../dist/colors.js';


const actionStyle = {
  color: 'white',
  backgroundColor: Colors.purple600,
  position: 'fixed',
  top: '95%',
  left: '50%',
  height:'40px',
  width:'160px',
  transform: 'translate(-50%, -50%)'
};

const showMarkersStyle = {
  color: 'white',
  backgroundColor: Colors.indigo600,
  position: 'fixed',
  top: '95%',
  left: 'calc(50% - 165px)',
  height:'40px',
  width:'160px',
  transform: 'translate(-50%, -50%)'
};

const hideMarkersStyle = {
  color: 'white',
  backgroundColor: Colors.deepPurple600,
  position: 'fixed',
  top: '95%',
  left: 'calc(50% + 165px)',
  height:'40px',
  width:'160px',
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
      console.log();
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
    var styles = [
      {
        featureType: 'water',
        stylers: [
          { color: '#19a0d8' }
        ]
      },{
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [
          { color: '#ffffff' },
          { weight: 6 }
        ]
      },{
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [
          { color: '#e85113' }
        ]
      },{
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          { color: '#efe9e4' },
          { lightness: -40 }
        ]
      },{
        featureType: 'transit.station',
        stylers: [
          { weight: 9 },
          { hue: '#e85113' }
        ]
      },{
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [
          { visibility: 'off' }
        ]
      },{
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
          { lightness: 100 }
        ]
      },{
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          { lightness: -100 }
        ]
      },{
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          { visibility: 'on' },
          { color: '#f0e4d3' }
        ]
      },{
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          { color: '#efe9e4' },
          { lightness: -25 }
        ]
      }
    ];

    var hackReactor = { lat: 37.791066, lng: -122.3991683 };
    var map = new googleMaps.Map(document.getElementById('map'), {
      zoom: 15,
      styles: styles,
      mapTypeControl: false,
      center: hackReactor
    });

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = this.makeMarkerIcon(Colors.limeA400.slice(1));

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = this.makeMarkerIcon(Colors.tealA400.slice(1));

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
        icon: defaultIcon,
        draggable: true,
        id: i
      });
      this.markers.push(marker);

      var ctx = this;
      marker.addListener('click', function() {
        ctx.populateInfoWindow(this, largeInfowindow);
      });
      bounds.extend(this.markers[i].position);

      // Two event listeners - one for mouseover, one for mouseout,
      // to change the colors back and forth.
      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });
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
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get a
      // panorama from that and set the options
      function getStreetView(data, status) {
        if (status === google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
            infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
        }
      }
      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      // Open the infowindow on the correct marker.
      infowindow.open(this.mapInstance, marker);
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

  makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
    return markerImage;
  }

  render() {
    return (
      <div className="container">
        <div className="options-box">
          <div>
          </div>
        </div>
        <div id="map"></div> 
          <RaisedButton 
            onTouchTap={this.getCoordinates.bind(this)}   
            label={<Link to='/schedule' style={linkStyle}>Schedule Ambit</Link> }
            buttonStyle={actionStyle}
            primary = {true}
            // containerElement={<Link to='/schedule'/>}
            fullWidth={false}
          ></RaisedButton>
          <RaisedButton 
            id="show-markers"
            onTouchTap={this.showMarkers.bind(this)}   
            label="show markers"
            buttonStyle={showMarkersStyle}
            primary = {true}
            fullWidth={false}
          ></RaisedButton>
          <RaisedButton 
            id="hide-markers"
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
