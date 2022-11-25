import React from 'react';
import './UserWatches.css';
import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import AuthContext from '../auth-context';


function UserWatches() {
  let authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() =>  {

    const baseUrl = 'http://localhost:3000/';
//    const email = 'tomwood2@gmail.com';
    const email = authContext.user;
    const url = `${baseUrl}monitor/site/userWatches/${email}`;

    const fetchData = async () => {

      setLoading(true);

      try {
        const result = await axios.get(url);
        setData(result.data);
      } catch (error) {
        console.error(error.message);
      }

      setLoading(false);
    }

    fetchData();

  }, []);

  if (loading) {
    return (<div>Loading</div>)
  }

  return (
    <div className="UserWatches">
      <header className="UserWatches-header">
        <ul>
          <li>{`ID: ${data.user._id}`}</li>
          <li>{`First Name: ${data.user.firstName}`}</li>
          <li>{`Last Name: ${data.user.lastName}`}</li>
          <li>{`email: ${data.user.email}`}</li>
        </ul>
        <ul>
          {data.userSites.map((site, index) => {
              return (
                <li key={index}>{site.name}</li>
              )
          })}
        </ul>
      </header>
    </div>
  );
}

export default UserWatches;
