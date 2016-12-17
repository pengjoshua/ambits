import React, { Component } from 'react';
import loadGoogleMapsAPI from 'load-google-maps-api';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';
import MarkerClusterer from 'node-js-marker-clusterer';
import * as Utils from '../utils/utils.js';
import * as Colors from './colors.js';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ToggleDisplay from 'react-toggle-display';


const modeMenu = [
  <MenuItem key={1} value={"WALKING"} primaryText="walk" />,
  <MenuItem key={2} value={"BICYCLING"} primaryText="bike" />,
  <MenuItem key={3} value={"DRIVING"} primaryText="drive" />,
  <MenuItem key={4} value={"TRANSIT"} primaryText="transit ride" />
];

const windowStyle = {
  marginTop: '64px', // set top bar height
};

const durationMenu = [
  <MenuItem key={1} value={"10"} primaryText="within 10 min" />,
  <MenuItem key={2} value={"15"} primaryText="within 15 min" />,
  <MenuItem key={3} value={"30"} primaryText="within 30 min" />,
  <MenuItem key={4} value={"60"} primaryText="within 1 hour" />
];

const showMarkersStyle = {
  color: 'white',
  backgroundColor: Colors.indigo600,
  position: 'fixed',
  top: 'calc(90% + 45px)',
  left: 'calc(50% - 82px)',
  height:'40px',
  width:'160px',
  transform: 'translate(-50%, -50%)'
};

const hideMarkersStyle = {
  color: 'white',
  backgroundColor: Colors.deepPurple600,
  position: 'fixed',
  top: '90%',
  left: 'calc(50% - 82px)',
  height:'40px',
  width:'160px',
  transform: 'translate(-50%, -50%)'
};

const actionStyle = {
  color: 'white',
  backgroundColor: Colors.purple600,
  position: 'fixed',
  top: '90%',
  left: 'calc(50% + 82px)',
  height:'40px',
  width:'160px',
  transform: 'translate(-50%, -50%)'
};

const drawingStyle = {
  color: 'white',
  backgroundColor: Colors.purple900,
  position: 'fixed',
  top: 'calc(90% + 45px)',
  left: 'calc(50% + 82px)',
  height:'40px',
  width:'160px',
  transform: 'translate(-50%, -50%)'
};

const floatingLabelStyle = {
  color: Colors.lime600
};

const floatingLabelFocusStyle = {
  color: Colors.blue500
};

const selectTimeStyle = {
  top: '50px',
  width: 180,
  left: '6%'
};

const selectModeStyle = {
  top: '50px',
  width: 180,
  left: '30px'
};

const zoomInputStyle = {
  top: '30px',
  width: 290,
  left: '3%',
  margin: '0 20px 0 0'
};

const panel = {
  position: 'fixed',
  zIndex: 9999,
  top: '1.5%',
  left: '50%'
};

const zoomTextStyle = {
  color: Colors.lime600
};

const zoomAreaStyle = {
  width: 290,
  left: '3%',
  margin: '0 20px 0 0'
}

const zoomStyle = {
  color: 'white',
  backgroundColor: Colors.purpleA200,
  // transform: 'translate(-50%, -50%)',
  height:'40px',
  width:'90px'
};

const destGo = {
  margin: '50px 15px 0 0'
};

const searchGo = {
  margin: '0 0 0 10px'
}

const radio = {
  margin: 0,
  width: 100
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

    this.placeMarkers = [];
    this.markers = [];
    this.ambits = [];
    this.map = {};
    this.googleMaps = {};
    this.centerMarker = {};
    this.drawingManager = {};
    this.polygon = null;
    this.state = {
      searchFieldValue: '',
      zoomFieldValue: '',
      withinFieldValue: '',
      modeValue: '',
      durationValue: '',
      show: false,
      radio: {
        time: '10',
        mode: 'WALKING',
      }
    }
  }

  componentWillMount() {
    Utils.getAllAmbits((res) => {
      this.ambits = this.ambits.concat(res);
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

      // var centerIcon = {
      //   url: 'http://icon-icons.com/icons2/864/PNG/512/Add_Circle_Plus_Download_icon-icons.com_67898.png',
      //   size: new google.maps.Size(20, 20),
      //   scaledSize: new google.maps.Size(20, 20),
      //   origin: new google.maps.Point(0,0)
      // };

      // googleMaps.event.addListener(map, 'dragend', () => {
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

    // This autocomplete is for use in the search within time entry box.
    var timeAutocomplete = new google.maps.places.Autocomplete(this.state.withinFieldValue);
    // This autocomplete is for use in the geocoder entry box.
    var zoomAutocomplete = new google.maps.places.Autocomplete(this.state.zoomFieldValue);
    //Bias the boundaries within the map for the zoom to area text.
    zoomAutocomplete.bindTo('bounds', map);
    // Create a searchbox in order to execute a places search
    var searchBox = new google.maps.places.SearchBox(
        document.getElementById('places-search'));
    // Bias the searchbox to within the bounds of the map.
    searchBox.setBounds(map.getBounds());

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
    // map.fitBounds(bounds);

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
    // console.log(Coords);
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
    var address = this.state.zoomFieldValue;
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

  searchWithinTime() {
    // Initialize the distance matrix service.
    var distanceMatrixService = new google.maps.DistanceMatrixService;
    // var address = document.getElementById('search-within-time-text').value;
    var address = this.state.withinFieldValue;
    console.log('address within time', address);
    // Check to make sure the place entered isn't blank.
    if (address == '') {
      window.alert('You must enter an address.');
    } else {
      this.hideMarkers();
      // Use the distance matrix service to calculate the duration of the
      // routes between all our markers, and the destination address entered
      // by the user. Then put all the origins into an origin matrix.
      var origins = [];
      for (var i = 0; i < this.markers.length; i++) {
        origins[i] = this.markers[i].position;
      }
      var destination = address;
      var mode = this.state.modeValue;
      console.log('mode within time', mode);
      console.log('mode within time radio', this.state.radio.mode);
      // var mode = document.getElementById('mode').value;
      // Now that both the origins and destination are defined, get all the
      // info for the distances between them.


      var ctx = this;
      distanceMatrixService.getDistanceMatrix({
        origins: origins,
        destinations: [destination],
        travelMode: google.maps.TravelMode[mode],
        unitSystem: google.maps.UnitSystem.IMPERIAL,
      }, (response, status) => {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
          window.alert('Error was: ' + status);
        } else {
          ctx.displayMarkersWithinTime(response);
        }
      });
    }
  }

  // This function will go through each of the results, and,
  // if the distance is LESS than the value in the picker, show it on the map.
  displayMarkersWithinTime(response) {
    console.log('displaymarkers durationValue', this.state.durationValue);
    console.log('mode within time time', this.state.radio.time);
    var maxDuration = this.state.durationValue;
    console.log('response', response);
    console.log('maxDuration', maxDuration);
    // var maxDuration = document.getElementById('max-duration').value;
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    // Parse through the results, and get the distance and duration of each.
    // Because there might be  multiple origins and destinations we have a nested loop
    // Then, make sure at least 1 result was found.
    var atLeastOne = false;
    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        var element = results[j];
        if (element.status === "OK") {
          // The distance is returned in feet, but the TEXT is in miles. If we wanted to switch
          // the function to show markers within a user-entered DISTANCE, we would need the
          // value for distance, but for now we only need the text.
          var distanceText = element.distance.text;
          // Duration value is given in seconds so we make it MINUTES. We need both the value
          // and the text.
          var duration = element.duration.value / 60;
          var durationText = element.duration.text;
          if (duration <= maxDuration) {
            //the origin [i] should = the markers[i]
            this.markers[i].setMap(this.map);
            atLeastOne = true;

            var ctx = this;
            var displayDirections = function (origin) {
              window.hideMarkers = ctx.hideMarkers.bind(ctx);
              window.hideMarkers();
              var directionsService = new google.maps.DirectionsService;
              // Get the destination address from the user entered value.
              // var destinationAddress = this.state.withinFieldValue;
              var destinationAddress = ctx.state.withinFieldValue;
              // Get mode again from the user entered value.
              // var mode = this.state.modeValue;
              var mode = ctx.state.modeValue;
              directionsService.route({
                // The origin is the passed in marker's position.
                origin: origin,
                // The destination is user entered address.
                destination: destinationAddress,
                travelMode: google.maps.TravelMode[mode]
              },
              (response, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                  var directionsDisplay = new google.maps.DirectionsRenderer({
                    map: ctx.map,
                    directions: response,
                    draggable: true,
                    polylineOptions: {
                      strokeColor: 'green'
                    }
                  });
                } else {
                  window.alert('Directions request failed due to ' + status);
                }
              });
            };
            window.displayDirections = displayDirections;
            // Create a mini infowindow to open immediately and contain the
            // distance and duration
            var infowindow = new google.maps.InfoWindow({
              content: durationText + ' away, ' + distanceText +
                '<div><input type=\"button\" value=\"View Route\" onclick=' +
                '\"window.displayDirections(&quot;' + origins[i] + '&quot;)\"></input></div>'
            });
            infowindow.open(map, this.markers[i]);
            // Put this in so that this small window closes if the user clicks
            // the marker, when the big infowindow opens
            this.markers[i].infowindow = infowindow;
            google.maps.event.addListener(this.markers[i], 'click', function() {
              this.infowindow.close();
            });
          }
        }
      }
    }
    if (!atLeastOne) {
      window.alert('We could not find any locations within that distance!');
    }
  }

  // This function fires when the user selects a searchbox picklist item.
  // It will do a nearby search using the selected query string or place.
  searchBoxPlaces(searchBox) {
    this.hideMarkers(this.placeMarkers);
    var places = searchBox.getPlaces();
    // For each place, get the icon, name and location.
    this.createMarkersForPlaces(places);
    if (places.length == 0) {
      window.alert('We did not find any places matching that search!');
    }
  }

  // This function firest when the user select "go" on the places search.
  // It will do a nearby search using the entered query string or place.
  textSearchPlaces() {
    var bounds = this.map.getBounds();
    this.hideMarkers(this.placeMarkers);
    var placesService = new google.maps.places.PlacesService(this.map);
    var ctx = this;
    placesService.textSearch({
      query: document.getElementById('places-search').value,
      bounds: bounds
    }, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        ctx.createMarkersForPlaces(results);
      }
    });
  }

  // This function creates markers for each place found in either places search.
  createMarkersForPlaces(places) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < places.length; i++) {
      var place = places[i];
      var icon = {
        url: place.icon,
        size: new google.maps.Size(35, 35),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: this.map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
        id: place.id
      });
      // If a marker is clicked, do a place details search on it in the next function.
      var ctx = this;
      marker.addListener('click', function() {
        ctx.getPlacesDetails(this, place);
      });
      this.placeMarkers.push(marker);
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    }
    this.map.fitBounds(bounds);
  }

  // This is the PLACE DETAILS search - it's the most detailed so it's only
  // executed when a marker is selected, indicating the user wants more
  // details about that place.
  getPlacesDetails(marker, infowindow) {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
      placeId: marker.id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // Set the marker property on this infowindow so it isn't created again.
        infowindow.marker = marker;
        var innerHTML = '<div>';
        if (place.name) {
          innerHTML += '<strong>' + place.name + '</strong>';
        }
        if (place.formatted_address) {
          innerHTML += '<br>' + place.formatted_address;
        }
        if (place.formatted_phone_number) {
          innerHTML += '<br>' + place.formatted_phone_number;
        }
        if (place.opening_hours) {
          innerHTML += '<br><br><strong>Hours:</strong><br>' +
              place.opening_hours.weekday_text[0] + '<br>' +
              place.opening_hours.weekday_text[1] + '<br>' +
              place.opening_hours.weekday_text[2] + '<br>' +
              place.opening_hours.weekday_text[3] + '<br>' +
              place.opening_hours.weekday_text[4] + '<br>' +
              place.opening_hours.weekday_text[5] + '<br>' +
              place.opening_hours.weekday_text[6];
        }
        if (place.photos) {
          innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
              {maxHeight: 100, maxWidth: 200}) + '">';
        }
        innerHTML += '</div>';
        infowindow.setContent(innerHTML);
        infowindow.open(this.map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
      }
    });
  }

  handleSearchFieldChange(e) {
    this.setState({ searchFieldValue: e.target.value });
  }

  handleZoomFieldChange(e) {
    this.setState({ zoomFieldValue: e.target.value });
  }

  handleWithinFieldChange(e) {
    this.setState({ withinFieldValue: e.target.value });
  }

  handleModeChange(e, index, value) {
    this.setState({ modeValue: value });
    console.log('handleModeChange', this.state.modeValue)
  }

  handleDurationChange(e, index, value) {
    this.setState({ durationValue: value });
    console.log('handleDurationChange', this.state.durationValue)
  }

  handleSearchSubmit(e) {
    e.preventDefault();
    this.textSearchPlaces();
    this.setState({ searchFieldValue: '' });
  }

  handleAreaSubmit(e) {
    e.preventDefault();
    this.zoomToArea();
    this.setState({ zoomFieldValue: '' });
  }

  handleWithinSubmit(e) {
    e.preventDefault();
    this.searchWithinTime();
    // this.setState({ withinFieldValue: '' });
  }

  setTime(time, selectedTime) {
    const radio = this.state.radio;
    radio[time] = selectedTime;
    this.setState({ radio: radio });
  };

  setMode(mode, selectedMode) {
    const radio = this.state.radio;
    radio[mode] = selectedMode;
    this.setState({ radio: radio });
  };

  showPanel() {
    this.setState({ show: !this.state.show });
  }


  render() {
    return (
      <div className="container" style={windowStyle}>

        <ToggleDisplay show={this.state.show}>
        <div className="options-box">

          <table className="timemode">
            <tbody>
              <tr>
                <td>
                  <SelectField
                    value={this.state.durationValue}
                    onChange={this.handleDurationChange.bind(this)}
                    floatingLabelText="time"
                    floatingLabelStyle={{ color: Colors.lime600.slice(1) }}
                    style={selectTimeStyle}
                  >{durationMenu}
                  </SelectField>
                </td>
                <td>
                  <SelectField
                    value={this.state.modeValue}
                    onChange={this.handleModeChange.bind(this)}
                    floatingLabelText="mode"
                    floatingLabelStyle={{ color: Colors.lime600.slice(1) }}
                    style={selectModeStyle}
                  >{modeMenu}
                  </SelectField>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="destination">
            <tbody>
              <tr>
                <td>
                  <form id="within" onSubmit={this.handleWithinSubmit.bind(this)}>
                    <TextField
                      id="within-text"
                      value={this.state.withinFieldValue}
                      onChange={this.handleWithinFieldChange.bind(this)}
                      floatingLabelText="destination"
                      floatingLabelStyle={floatingLabelStyle}
                      floatingLabelFocusStyle={floatingLabelFocusStyle}
                      hintStyle={zoomTextStyle}
                      style={zoomInputStyle}
                    />
                  </form>
                </td>
                <td>
                  <RaisedButton
                    label="go"
                    labelPosition="before"
                    primary={true}
                    icon={<ActionAndroid />}
                    onClick={this.searchWithinTime.bind(this)}
                    style={destGo}
                  />

                </td>
              </tr>
            </tbody>
          </table>

        <table className="area">
          <tbody>
            <tr>
              <td>
                <form id="area-field" onSubmit={this.handleAreaSubmit.bind(this)}>
                  <TextField
                    id="zoom-to-area-text"
                    value={this.state.zoomFieldValue}
                    onChange={this.handleZoomFieldChange.bind(this)}
                    floatingLabelText="Zoom in on area or address"
                    floatingLabelStyle={floatingLabelStyle}
                    floatingLabelFocusStyle={floatingLabelFocusStyle}
                    hintStyle={zoomTextStyle}
                    style={zoomAreaStyle}
                  />
                </form>
                </td>
                <td>
                  <RaisedButton
                    id="zoom-to-area"
                    onTouchTap={this.zoomToArea.bind(this)}
                    label="Zoom"
                    buttonStyle={zoomStyle}
                    primary = {true}
                    fullWidth={false}
                  ></RaisedButton>
                </td>
              </tr>
            </tbody>
          </table>

          <table>
            <tbody>
              <tr>
                <td>
                  <span className="searchText">Search for nearby places</span>
                  <form id="search-field" onSubmit={this.handleSearchSubmit.bind(this)}>
                    <input
                      id="places-search"
                      size='25'
                      type="text"
                      placeholder="Ex: Hack Reactor, SF"
                      value={this.state.searchFieldValue}
                      onChange={this.handleSearchFieldChange.bind(this)}
                    />
                  </form>
                </td>
                <td>
                  <RaisedButton
                    label="go"
                    labelPosition="after"
                    secondary={true}
                    icon={<ActionAndroid />}
                    onClick={this.textSearchPlaces.bind(this)}
                    style={searchGo}
                  />
                </td>
              </tr>
            </tbody>
          </table>

        </div>
        </ToggleDisplay>

          <FloatingActionButton
            mini={true}
            onTouchTap={this.showPanel.bind(this)}
            style={panel}
            secondary={true}
          >
            <ContentAdd />
          </FloatingActionButton>

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

      </div>
    )
  }
}

export { Coords }; //there is single-entry point to schedule and it is through maps.
export default Map;
