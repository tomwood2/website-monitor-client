import React from 'react';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import './my-watches-page.css';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

import { PageLayout } from '../components/page-layout';
import { PageLoader } from "../components/page-loader";
import { SearchChoreographer } from '../components/search-choreographer';


const MyWatchesPage = () => {

  const {user: auth0User, getAccessTokenSilently} = useAuth0();
  const userId = auth0User['https://tomwood2.com/_id']; // funky property name
  const [choreographers, setChoreographers] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [fetch, setFetch] = useState(0);

  const [showSearch, setShowSearch] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // const baseUrl = 'http://localhost:3000/';
  const baseUrl = 'https://api.tomwood2.com/';

  useEffect(() =>  {
    (async () => {

      // setLoading(true);

      try {

        const url = `${baseUrl}monitor/user/watches/choreographers/${userId}`;

        const token = await getAccessTokenSilently({
          audience: 'api.tomwood2.com', // Value in Identifier field for the API being called.
        });

        const result = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        setChoreographers(result.data);
        setIsModified(false);
      } catch (error) {
        console.error(error.message);
      }

      // setLoading(false);
    })();
  }, [fetch, getAccessTokenSilently]);

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  const handleSetEditMode = () => {
    setFetch((fetch) => ++fetch);
    setEditMode(true);
    // automatically show the search
    // screen when choro list is empty
    setShowSearch(choreographers.length === 0);
  };

  const handleCancel = () => {
    unsetEditMode();
    setFetch((fetch) => ++fetch);
  }

  const handleSave = () => {
    (async () => {

      const url = `${baseUrl}monitor/user/watches/choreographers/${userId}`;

      try {
        const token = await getAccessTokenSilently({
          audience: 'api.tomwood2.com', // Value in Identifier field for the API being called.
        });
        const result = await axios.post(url, choreographers, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        unsetEditMode();

      } catch (error) {
        console.error(error.message);
      }

   })();
  }

  const unsetEditMode = () => {
    setEditMode(false);
    handleCloseSearch();
  };

  const handleDelete = (event) => {
    const index =  parseInt(event.target.dataset.index);
    setChoreographers((choreographers) => {
      let newChoreographers = choreographers.slice();
      newChoreographers.splice(index, 1);
      return newChoreographers;
    });
  }

  const handleAddWatch = (choreographer) => {

    const found = choreographers.find(c => c._id === choreographer._id);

    if (found) {
      return; // ignore if already in the list
    }

    setChoreographers((choreographers) => {
      // make a new array so set state triggers render
      let newChoreographers = choreographers.slice();
      newChoreographers.push(choreographer);

      newChoreographers.sort((a, b) => {

        if (a.lastName < b.lastName) {
          return -1;
        }

        if (a.lastName === b.lastName) {
          // same last names

          if (a.firstName < b.firstName) {
            return -1;
          }

          if (a.firstName === b.firstName) {
            return 0;
          }

          return 1; // a.firstName > b.firstName
        }

        return 1; // a.lastName > b.lastName
      });

      return newChoreographers;
    });

    setIsModified(true);
  };

  // if (loading) {
  //   return (<div>Loading</div>)
  // }
  
  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          My Watches
        </h1>
        <div className="content__body">
          {/* <p id="page-description">
          <span>
              Below is the list of choreogrphers that you are watching for new line dances.
          </span>
          </p> */}
            <div className="my-watches-grid">
              <div className="profile__header">
                <img
                  src={auth0User.picture}
                  alt="Profile"
                  className="profile__avatar"
                />
                <div className="profile__headline">
                  <h2 className="profile__title">{auth0User.name}</h2>
                  <span className="profile__description">{auth0User.email}</span>
                </div>
              </div>

              {!editMode && choreographers.length === 0 && 
                <h3 className='my-watches-no-list'>You have no choreographer watches configured.</h3>
              }

              {choreographers.length > 0 &&
                <div className="my-watches-list">

                {choreographers.map((choreographer, index) => {
                  return (
                    <div key={choreographer._id} className='my-watches-list-row'>

                      {editMode &&
                        <div className='my-watches-list-cell'>
                            <button
                              className='button button--compact button--secondary my-watches-delete-button'
                              data-index={index}
                              onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                      }

                      <div className='my-watches-list-cell'>
                        {choreographer.name}
                      </div>

                      {/* this button keeps row height consistent between edit and non-edit modes */}
                      <div className='my-watches-list-cell'>
                          <button className='button button--compact button--secondary my-watches-dummy-button' >dummy</button>
                      </div>
                  
                    </div>
                  )
                  })}
                </div>
              }

              <div className='my-watches-button-bar'>
                {!editMode &&
                  <button className='button button--primary button--compact' onClick={handleSetEditMode}>Edit</button>
                }
                {editMode &&
                  <>
                    <button className='button button--primary button--compact' onClick={handleSave}>Save</button>
                    <button className='button button--primary button--compact' onClick={handleCancel}>Cancel</button>
                    {!showSearch &&
                      <button className='button button--primary button--compact' onClick={handleShowSearch}>Add</button>
                    }
                  </>
                }
              </div>

                {showSearch && 
                  <SearchChoreographer handleClose={handleCloseSearch} handleAdd={handleAddWatch} />
                }

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
