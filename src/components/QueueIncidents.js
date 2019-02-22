import React, {Component} from 'react';
import EmergencyDetails from './EmergencyDetails';
import fire from '../config/Fire';
import _ from 'lodash';

class QueueIncidents extends Component {
   
    constructor(props){
        super(props);
        this.state = {
            

            incidentsList : [{
                incidentType: '',
                incidentLocation: '',
                isResponded: ''
            }]
        }

        let app = fire.database().ref('/incidents');
        app.on('value', snapshot => {
            this.getData(snapshot.val());
        })
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

    render(){
        
        let incidentNodes = this.state.incidentsList.map((incidents, key) => {
            return (
                <div className='item' key={key}>
                    <EmergencyDetails 
                        incidentType = {incidents.incidentType} 
                        incidentLocation = {incidents.incidentLocation} 
                    />
                </div>
            );
            
        });
        
        return (
            <div className="hidescrollbar">
                <div className="ui visible left vertical sidebar menu">
                        {incidentNodes}
                </div></div>
        );
    }
}

export default QueueIncidents;