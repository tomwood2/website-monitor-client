import React from 'react';
import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import AuthContext from '../auth-context';

function AuthStatus() {
    let authContext = useContext(AuthContext);
    let navigate = useNavigate();
  
    if (!authContext.user) {
      return <p>You are not logged in.</p>;
    }
  
    return (
      <p>
        Welcome {authContext.user}!{" "}
        <button
          onClick={() => {
            authContext.signout(() => navigate("/"));
          }}
        >
          Sign out
        </button>
      </p>
    );
  }
  
  export default AuthStatus;