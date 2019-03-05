import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
  Circle
} from "react-google-maps";
import { compose, withProps, withStateHandlers } from "recompose";
import { Button, Modal,} from 'semantic-ui-react';
//load custom markers for map
import vehicularUnresponded from '../../src/images/va_new.png';
import vehicularResponding from '../../src/images/va_otw.png';
import vehicularSettled from '../../src/images/va_fin.png';
import physicalUnresponded from '../../src/images/pi_new.png';
import physicalResponding from '../../src/images/pi_otw.png';
import physicalSettled from '../../src/images/pi_fin.png';

const MapWithPlaces = compose(
  
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDnJpxYlDPNrGJSQir9SoWBEbMaFa5Nv5w&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: "100vh", width: "100%" }} />,
    mapElement: <div style={{ height: "100%" }} />
  }),
  withStateHandlers(
    props => ({
      infoWindows: props.places.map(p => {
        return { isOpen: false };
      })
    }),
    {
      onToggleOpen: ({ infoWindows }) => selectedIndex => ({
        infoWindows: infoWindows.map((iw, i) => {
          iw.isOpen = selectedIndex === i;
          return iw;
        })
      })
    }
  ),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={props.zoom} defaultCenter={props.center}>
    {props.places &&
      props.places.map((place, i) => {
        let lat = parseFloat(place.coordinates.lat, 10);
        let lng = parseFloat(place.coordinates.lng, 10);     
        let incidentLogo = setLogo(place.incidentType, place.unresponded, place.isResponding, place.isSettled);

        return (
            <div key = {i}>
                <Modal size="tiny" trigger={<Marker
                  position={{ lat: lat, lng: lng }}
                  title={place.incidentLocation} 
                  icon={{
                    url: incidentLogo,
                    scaledSize: new window.google.maps.Size(50,50) 
                  }}>
                  <Circle center={{lat: lat, lng: lng}} radius={350} visible={true} 
                    options={{
                      strokeColor: '#babfc7',
                      fillColor: '#7d899e',
                      strokeOpacity: 0.5,
                      strokeWeight: 1,
                      fillOpacity: 0.5,
                      }}   
                  />
                  </Marker>}>
                    <Modal.Header>New Emergency</Modal.Header>
                    <Modal.Content>
                          <p>Reported by: Regular User</p>
                          <p>Type of Incident: {place.incidentType}</p>
                          <p>Location of Incident: {place.incidentLocation}</p>
                          <p>Photo of Incident:</p>
                      </Modal.Content>
                      <Modal.Actions>
                          <Button basic color='green'>
                              Dispatch Responders
                          </Button>
                          <Button basic color='green'>
                              Request Volunteers
                          </Button>
                      </Modal.Actions>
                </Modal>

            </div>
        );
      })}
  </GoogleMap>
));

//assigns the custom markers
const setLogo = (incidentType, unresponded, responding, settled) => {
  let logo = null;
  switch(incidentType){
    case 'Vehicular Accident':
      if(unresponded){
        logo = vehicularUnresponded;
      }else if(responding){
        logo = vehicularResponding;
      }else if(settled){
        logo = vehicularSettled;
      }
      break;
    case 'Physical Injury':
      if(unresponded){
        logo = physicalUnresponded;
      }else if(responding){
        logo = physicalResponding;
      }else if(settled){
        logo = physicalSettled;
      }
      break;
    default:
      break;
  }
  return logo;
}

export default MapWithPlaces;