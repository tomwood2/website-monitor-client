import React from 'react';
import {Link, Outlet} from 'react-router-dom';
import AuthStatus from './AuthStatus';

function Layout() {
    return (
      <div>
        <AuthStatus />
  
        <ul>
          <li>
            <Link to="/">Home Page</Link>
          </li>
          <li>
            <Link to="/protected">My Watches</Link>
          </li>
        </ul>
  
        <Outlet />
      </div>
    );
  }

  export default Layout;