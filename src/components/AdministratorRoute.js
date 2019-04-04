import React from "react";
//import DashboardAdmin from './DashboardCCPersonnel';
//import { Route, Redirect } from "react-router-dom";
import {
 
  Route,
 
  Redirect,
  
} from 'react-router'

// export const AdministratorRoute = ({
//   component: Component,
//   ...rest
// }) => {
//   return (
//     <Route
//       {...rest}
//       render={props => {
//         if (props.user_type === 'Command Center Personnel') {
//           return <Component {...props} />;
//         } else {i
//           return (
//             <Redirect
//               to={{
//                 pathname: "/",
//                 state: {
//                   from: props.location
//                 }
//               }}
//             />
//           );
//         }
//       }}
//     />
//   );
// };

// export const AdministratorRoute = ({ component: Component, ...rest }) => (
//   <Route {...rest} render={(props) => (
//     props.user_type === 'Administrator'
//       ? <Component {...props} />
//       : <Redirect to='/login' />
//   )} />
// )

// export const AdministratorRoute = ({ component: Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={(props) =>
//       (this.props.user_type === 'Administrator') ? (
//         <Component {...props} {...rest} />
//       ) : (
//         <Redirect
//           to={{
//             pathname: "/login",
//           }}
//         />
//       )
//     }
//   />
// );

const AdministratorRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      (this.props.user_type === 'Administrator') ? (
        <Component {...props} {...rest} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default AdministratorRoute;