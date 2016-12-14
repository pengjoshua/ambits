import React, { Component } from 'react';
import loadGoogleMapsAPI from 'load-google-maps-api';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';
import MarkerClusterer from 'node-js-marker-clusterer';
import * as Utils from '../utils/utils.js';
import * as Colors from '../../../dist/colors.js';
import TextField from 'material-ui/TextField';


const actionStyle = {
  color: 'white',
  backgroundColor: Colors.purple600,
  position: 'fixed',
  top: '85%',
  left: '50%',
  height:'40px',
  width:'160px',
  transform: 'translate(-50%, -50%)'
};

const showMarkersStyle = {
  color: 'white',
  backgroundColor: Colors.indigo600,
  position: 'fixed',
  top: '85%',
  left: 'calc(50% - 165px)',
  height:'40px',
  width:'160px',
  transform: 'translate(-50%, -50%)'
};

const hideMarkersStyle = {
  color: 'white',
  backgroundColor: Colors.deepPurple600,
  position: 'fixed',
  top: '85%',
  left: 'calc(50% + 165px)',
  height:'40px',
  width:'160px',
  transform: 'translate(-50%, -50%)'
};

const drawingStyle = {
  color: 'white',
  backgroundColor: Colors.pink600,
  position: 'fixed',
  top: '85%',
  left: 'calc(50% + 330px)',
  height:'40px',
  width:'160px',
  transform: 'translate(-50%, -50%)'
};

const zoomStyle = {
  color: 'white',
  backgroundColor: Colors.purpleA200,
  position: 'fixed',
  top: '85%',
  left: 'calc(50% - 330px)',
  height:'40px',
  width:'160px',
  transform: 'translate(-50%, -50%)'
};

const floatingLabelStyle = {
  color: Colors.orange500
};

const floatingLabelFocusStyle = {
  color: Colors.blue500
};

const zoomTextStyle = {
  color: Colors.lime600,
  top: '95%',
  left: '50%'
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
    this.map = {};
    this.googleMaps = {};
    this.centerMarker = {};
    this.drawingManager = {};
    this.polygon = null;
    this.state = {
      textFieldValue: ''
    }
  }

  componentWillMount() {
    Utils.getAllAmbits((res) => {
      this.ambits = this.ambits.concat(res);
      console.log('ambits', this.ambits);
    });
  }
  
  componentDidMount() {
    loadGoogleMapsAPI({
      // key: "AIzaSyAHJfNJp8pbRxf_05L1TIm5ru-Dvcla-Nw",
      key: 'AIzaSyCwsH_IC4bKctVzu1KGpK4KBO9yPnxSjbc',
      libraries: ['drawing','places','geometry'],
      v: '3.25'
    }).then((googleMaps) => {
      this.initMap(googleMaps);
      var map = this.map; // new instance of googleMaps

      // googleMaps.event.addListener(map, 'drag', () => {
      //   var centerLatLng = map.getCenter();
      //   this.centerMarker.setPosition(centerLatLng);
      // });

    });
  }

  initMap(googleMaps) {
    // This global polygon variable is to ensure only ONE polygon is rendered.
    var polygon = null;
    var markers = [];
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
      markers.push(marker);

      var ctx = this;
      marker.addListener('click', function() {
        ctx.populateInfoWindow(this, largeInfowindow);
      });
      bounds.extend(markers[i].position);

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

    var drawingManager = new googleMaps.drawing.DrawingManager({
      drawingMode: googleMaps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: googleMaps.ControlPosition.TOP_LEFT,
        drawingModes: [
          googleMaps.drawing.OverlayType.POLYGON
        ]
      }
    });

    drawingManager.addListener('overlaycomplete', function(event) {
      // First, check if there is an existing polygon.
      // If there is, get rid of it and remove the markers
      if (polygon) {
        polygon.setMap(null);
        hideListings(markers);
      }
      // Switching the drawing mode to the HAND (i.e., no longer drawing).
      drawingManager.setDrawingMode(null);
      // Creating a new editable polygon from the overlay.
      polygon = event.overlay;
      polygon.setEditable(true);
      // Searching within the polygon.

      // This function hides all markers outside the polygon,
      // and shows only the ones within it. This is so that the
      // user can specify an exact area of search.
      function searchWithinPolygon() {
        for (var i = 0; i < markers.length; i++) {
          if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)) {
            markers[i].setMap(map);
          } else {
            markers[i].setMap(null);
          }
        }
      };
      searchWithinPolygon();
      // Make sure the search is re-done if the poly is changed.
      polygon.getPath().addListener('set_at', searchWithinPolygon);
      polygon.getPath().addListener('insert_at', searchWithinPolygon);
    });

    this.markers = markers;
    this.polygon = polygon;
    this.drawingManager = drawingManager;
    this.map = map;
    this.centerMarker = marker;
    this.googleMaps = googleMaps;
  }

  getCoordinates() {
    Coords = {
      latitude: this.map.getCenter().lat(),
      longitude: this.map.getCenter().lng()
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
      infowindow.open(this.map, marker);
    }
  }

  showMarkers() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(this.map);
      bounds.extend(this.markers[i].position);
    }
    this.map.fitBounds(bounds);
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

  // This shows and hides (respectively) the drawing options.
  toggleDrawing() {
    if (this.drawingManager.map) {
      this.drawingManager.setMap(null);
      // In case the user drew anything, get rid of the polygon
      if (this.polygon !== null) {
        this.polygon.setMap(null);
      }
    } else {
      this.drawingManager.setMap(this.map);
    }
  }

  // This function takes the input value in the find nearby area text input
  // locates it, and then zooms into that area. This is so that the user can
  // show all listings, then decide to focus on one area of the map.
  zoomToArea() {
    // Initialize the geocoder.
    var geocoder = new google.maps.Geocoder();
    // Get the address or place that the user entered.
    // var address = document.getElementById('zoom-to-area-text').value;
    var address = this.state.textFieldValue;
    console.log('address', address);
    // Make sure the address isn't blank.
    if (address === '') {
      window.alert('You must enter an area, or address.');
    } else {
      // Geocode the address/area entered to get the center. Then, center the map
      // on it and zoom in
      geocoder.geocode(
      { 
        address: address,
        componentRestrictions: { locality: 'San Francisco' }
      }, 
      (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          this.map.setCenter(results[0].geometry.location);
          this.map.setZoom(18);
        } else {
          window.alert('We could not find that location - try entering a more specific place.');
        }
      });
    }
  }

  handleTextFieldChange(e) {
    this.setState({
      textFieldValue: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.zoomToArea();
    this.setState({ textFieldValue: '' });
  }


  render() {
    return (
      <div className="container">
        <div className="options-box">
          <div>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <TextField
              id="zoom-to-area-text"
              value={this.state.textFieldValue}
              onChange={this.handleTextFieldChange.bind(this)}
              floatingLabelText="Enter area or address"
              floatingLabelStyle={floatingLabelStyle}
              floatingLabelFocusStyle={floatingLabelFocusStyle}
              hintStyle={zoomTextStyle}
            />
          </form>
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
            label="Show markers"
            buttonStyle={showMarkersStyle}
            primary = {true}
            fullWidth={false}
          ></RaisedButton>
          <RaisedButton 
            id="hide-markers"
            onTouchTap={this.hideMarkers.bind(this)}   
            label="Hide markers"
            buttonStyle={hideMarkersStyle}
            primary = {true}
            fullWidth={false}
          ></RaisedButton>
          <RaisedButton 
            id="toggle-drawing"
            onTouchTap={this.toggleDrawing.bind(this)}   
            label="Drawing tools"
            buttonStyle={drawingStyle}
            primary = {true}
            fullWidth={false}
          ></RaisedButton>
          <RaisedButton 
            id="zoom-to-area"
            onTouchTap={this.zoomToArea.bind(this)}   
            label="Zoom"
            buttonStyle={zoomStyle}
            primary = {true}
            fullWidth={false}
          ></RaisedButton>
      </div>
    )
  }
}

export { Coords }; //there is single-entry point to schedule and it is through maps.
export default Map;
