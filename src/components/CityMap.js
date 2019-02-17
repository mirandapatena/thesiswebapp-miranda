import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={15}
        style={mapStyles}
        //Mandaue City coords
        // lat: 10.333333,
        // lng: 123.933334
        
        //MCPO coords
        // 10.324646, 123.942197
        initialCenter={{
         lat: 10.324646,
         lng: 123.942197
        }}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDnJpxYlDPNrGJSQir9SoWBEbMaFa5Nv5w'
})(MapContainer);
