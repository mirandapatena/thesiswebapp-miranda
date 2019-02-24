import React, {Component} from 'react';
import _ from "lodash";
import fire from '../config/Fire';
import MapWithPlaces from './MapWithPlaces';

class CityMap extends Component {
    constructor(props){
      super(props);
      this.state = {
          incidentsList: [{
              key: '',
              incidentType: '',
              incidentLocation: '',
              coordinates: {
                lng: '',
                lat: ''
              },
              responded: null
          }]
      }
      let app = fire.database().ref('/incidents');
      app.on('value', snapshot => {
          this.getData(snapshot.val());
      });
  }

  getData = (values) => {
      let incidentValues = values;
      let incidentsList = _(incidentValues)
                          .keys()
                          .map(incidentKey => {
                              let cloned = _.clone(incidentValues[incidentKey]);
                              cloned.key = incidentKey;
                              return cloned;
                          })
                          .value();
      this.setState({incidentsList: incidentsList});
  }
  
  render() { 
    return(
      <div>
        {console.log('city map keys', this.state.incidentsList)}
        <MapWithPlaces 
          center={{ lat: 10.324646, lng: 123.942197 }}
          zoom={15}
          places={this.state.incidentsList}
        />
      </div>
    );
  }
}

export default CityMap;

    //Mandaue City coords
        // lat: 10.333333,
        // lng: 123.933334
        
        //MCPO coords
        // 10.324646, 123.942197