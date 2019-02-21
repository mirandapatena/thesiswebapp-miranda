import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
  InfoWindow
} from "react-google-maps";
import { compose, withProps, withStateHandlers } from "recompose";


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
        console.log('mapwithplaces', props);
        return (
          <Marker
            position={{ lat: lat, lng: lng }}
            title="Location"
            onClick={props.onToggleOpen.bind(this, i)}
            key = {i}
          >
            {/*props.infoWindows[i].isOpen && (
              <InfoWindow onCloseClick={props.onToggleOpen.bind(i)}>
                <div>{place.incidentType}</div>
              </InfoWindow>
            )*/}
          </Marker>
        );
      })}
  </GoogleMap>
));

export default MapWithPlaces;
