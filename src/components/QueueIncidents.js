import React, {Component} from 'react';
import EmergencyDetails from './EmergencyDetails';
import _ from 'lodash';
import {connect} from 'react-redux';
import {getIncidents} from '../actions/incidentAction';
import swal from 'sweetalert';
import '../stylesheet_QueueIncidents.css';

class QueueIncidents extends Component {
   
    constructor(props){
        super(props);
        this.state = {
            incidentsList : [{
                key: '',
                isSettled: false,
                isShown: false,
                incidentType: '',
                incidentLocation: '',
                isResponded: '',
                coordinates: {
                    lng: '',
                    lat: ''
                },
            }],
        }
        this.renderEmergency = this.renderEmergency.bind(this);
        
    }

    componentDidMount(){
        this.props.getIncidents();
    }


    renderEmergency = () => {        
        return _.map(this.props.incidentsList, (incident, key) => {
            // console.log('timeReceived:', incident.timeReceived);
            // var timeToNumber = Date.parse(incident.timeReceived);
            // console.log('timetoInteger:', timeToNumber);

            // var points = [40, 100, 1, 5, 25, 10];
            // var p = points.sort(function(a, b){return b - a});
            // console.log('points', p);

            if(incident.isSettled === false){
                return (
                    <div className='item' key={key}>
                        <EmergencyDetails 
                            timeReceived = {incident.timeReceived}
                            incidentType = {incident.incidentType} 
                            incidentLocation = {incident.incidentLocation}
                            coordinates = {incident.coordinates}
                            incidentKey = {key}
                            reportedBy = {incident.reportedBy}
                        />
                    </div>
                );
                
            }
            if(incident.isSettled === true && incident.isShown === false){   
                var a = incident.incidentType;
                var b = incident.incidentLocation;  
                swal(b,a,{ button: "Ok!", icon:"success", text:"Incident is settled!"});
            }
            
        });
    }
    
    render(){
        
        return (
            <div className="hidescrollbar">
                <div className="ui visible left vertical sidebar menu">
                        {this.renderEmergency()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps){
    console.log('incidentsList', state.incidents);
    return {
        incidentsList: state.incidents,
    }
}
 


export default connect(mapStateToProps, {getIncidents})(QueueIncidents);