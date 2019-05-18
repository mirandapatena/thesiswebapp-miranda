import VerticalMenu from './VerticalMenu';
import React, {Component} from 'react'
import '../stylesheet_QueueIncidents.css';

class Profile extends Component{

    render(){
        return(
            <div>
                <div className="VerticalMenu">
                    <VerticalMenu/>
                </div>
                
                <div className="Profilepage">
                    <h1>MY PROFILE BITCH!</h1>
                </div>
            </div>
        )
    }



}

export default Profile;