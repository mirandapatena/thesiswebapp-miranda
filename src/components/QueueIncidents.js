import React, {Component} from 'react';
import EmergencyDetails from './EmergencyDetails';
import _ from 'lodash';
import {connect} from 'react-redux';
import {getIncidents} from '../actions/incidentAction';

class QueueIncidents extends Component {
   
    constructor(props){
        super(props);
        this.state = {
            incidentsList : [{
                key: '',
                incidentType: '',
                incidentLocation: '',
                isResponded: '',
                coordinates: {
                    lng: '',
                    lat: ''
                }
            }]
        }
        this.renderEmergency = this.renderEmergency.bind(this);
    }

    componentDidMount(){
        this.props.getIncidents();
    }

    renderEmergency = () => {
        return _.map(this.props.incidentsList, (incident, key) => {
            console.log('que coords', incident.coordinates);
            return (
                <div className='item' key={key}>
                    <EmergencyDetails 
                        incidentType = {incident.incidentType} 
                        incidentLocation = {incident.incidentLocation}
                        coordinates = {incident.coordinates}
                    />
                </div>
            );
        });
    }

    render(){
        return (
            <div className="hidescrollbar">
                <div className="ui visible left vertical sidebar menu">
                        {this.renderEmergency()}
                </div></div>
        );
    }
}

function mapStateToProps(state, ownProps){
    console.log('incidentsList', state.incidents);
    return {
        incidentsList: state.incidents
    }
}

export default connect(mapStateToProps, {getIncidents})(QueueIncidents);