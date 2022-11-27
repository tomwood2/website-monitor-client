import React from 'react';
import './UserWatches.css';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { PageLayout } from './page-layout';


function UserWatches() {
  const { user } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() =>  {

    console.log('in UserWatches.useEffect');

    const baseUrl = 'http://localhost:3000/';
    const email = user.email;
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

  }, [user.email]);

  if (loading) {
    return (<div>Loading</div>)
  }

  // return (
  //   <div className="UserWatches">
  //     <header className="UserWatches-header">
  //       <ul>
  //         <li>{`ID: ${data.user._id}`}</li>
  //         <li>{`First Name: ${data.user.firstName}`}</li>
  //         <li>{`Last Name: ${data.user.lastName}`}</li>
  //         <li>{`email: ${data.user.email}`}</li>
  //       </ul>
  //       <ul>
  //         {data.userSites.map((site, index) => {
  //             return (
  //               <li key={index}>{site.name}</li>
  //             )
  //         })}
  //       </ul>
  //     </header>
  //   </div>
  // );

  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          User Watches
        </h1>
        <div className="content__body">
          <p id="page-description">
          <span>
              You can use the <strong>ID Token</strong> to get the profile
              information of an authenticated user.
            </span>
            <span>
              <strong>Only authenticated users can access this page.</strong>
            </span>
         </p>
          <div className="profile-grid">
            <div className="profile__header">
              <img
                src={user.picture}
                alt="Profile"
                className="profile__avatar"
              />
              <div className="profile__headline">
                <h2 className="profile__title">{user.name}</h2>
                <span className="profile__description">{user.email}</span>
              </div>
            </div>
            <div className="profile__details">
            <ul>
              {data.userSites.map((site, index) => {
              return (
                <li key={index}>{site.name}</li>
              )
          })}
        </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );

}

export default UserWatches;
