import React, {Component} from 'react'
import QueueIncidents from './QueueIncidents';
import CityMap from './CityMap';
import HeaderDashboard from './HeaderDashboard';

class Dashboard extends Component {

    render(){
        return (
            <div className="ui visible">
                <HeaderDashboard/>
                <div className="ui bottom attached segment pushable" style={{minHeight: '100vh', display: 'flex', flexFlow: 'column nowrap'}}>
                    <QueueIncidents/>
                    <div className="pusher">
                        <div className="ui basic segment" style={{minHeight: '100vh', display: 'flex', flexFlow: 'column nowrap'}}>
                            <CityMap/>
                        </div>
                    </div>
                </div>
            
            </div>
            
        );
    }
}

export default Dashboard;