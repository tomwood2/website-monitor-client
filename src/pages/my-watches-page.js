import React from 'react';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import './my-watches-page.css';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { PageLayout } from '../components/page-layout';
import { PageLoader } from "../components/page-loader";


const MyWatchesPage = () => {
  const { user } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() =>  {

    console.log('in MyWatches.useEffect');

//    const baseUrl = 'http://localhost:3000/';
    const baseUrl = 'https://api.tomwood2.com/';
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
  
  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          My Watches
        </h1>
        <div className="content__body">
          <p id="page-description">
          <span>
              Below is the list of choreogrphers that you are watching for new line dances.
            </span>
            {/* <span>
              <strong>Only authenticated users can access this page.</strong>
            </span> */}
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

};

const ProtectedMyWatchesPage = withAuthenticationRequired(MyWatchesPage, {
  onRedirecting: () => <PageLoader />,
  returnTo: '/my-watches',
});

export {ProtectedMyWatchesPage};