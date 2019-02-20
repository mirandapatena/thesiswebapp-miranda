import React, {Component} from 'react'
import QueueIncidents from './QueueIncidents';
import CityMap from './CityMap';
import HeaderDashboard from './HeaderDashboard';

class Dashboard extends Component {

    render(){
        return (
            <div className="ui visible">
                <div className="ui bottom attached segment pushable" style={{minHeight: '100vh', display: 'flex', flexFlow: 'column nowrap'}}>
                    <QueueIncidents/>
                    <div className="pusher"> 
                        <div className="ui basic segment" >
                            <div style={{maxHeight:'100%', maxWidth:'83.5%', flexFlow: 'column nowrap'}}>
                             <HeaderDashboard/>
                            </div>
                            <div style={{minHeight: '100vh', display: 'flex', flexFlow: 'column nowrap'}}>
                                <CityMap/>
                            </div>
                        </div>
                    </div>
                </div>
           </div>
                  
            
            
            
        );
    }
}

export default Dashboard;