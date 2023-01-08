import React from 'react';
import { withAuthenticationRequired } from "@auth0/auth0-react";
import './my-watches-page.css';
import {useState, useEffect} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApi, UseApiShowError } from '../hooks/use-api';

import { PageLayout } from '../components/page-layout';
import { PageLoader } from "../components/page-loader";
import { SearchChoreographer } from '../components/search-choreographer';

const MyWatchesPage = () => {

  ///////////////////
  // constants

  const baseUrl = 'https://api.tomwood2.com/';

  ///////////////////
  // begin hooks

  const {user: auth0User, getAccessTokenWithPopup } = useAuth0();
  const userId = auth0User['https://tomwood2.com/_id']; // funky property name
  const [isModified, setIsModified] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [apiChoreographers, setApiChoreographers] = useState([]);
  const [choreographers, setChoreographers] = useState([]);
  const [, setPostChoreographersResult] = useState(null);

  const getWatchesConfig = {
    audience: 'api.tomwood2.com',
    scope: undefined,
    method: 'get',
    url: `${baseUrl}monitor/user/watches/choreographers/${userId}`,  
  }

  // read choreographers
  const {isLoading, error, apiSuccessIndex: getSuccessIndex, refresh: getApiChoreographers } =
    useApi(setApiChoreographers, getWatchesConfig);

  const postChoreogrphersConfig = {
    audience: 'api.tomwood2.com',
    scope: undefined,
    method: 'post',
    url: `${baseUrl}monitor/user/watches/choreographers/${userId}`,
    data: choreographers,
  }

  // post choreographers
  const {isLoading: isSaving, error: postError, apiSuccessIndex: postChoreographersSuccessIndex, refresh: postChoreographers } =
    useApi(setPostChoreographersResult, postChoreogrphersConfig, false);
  
  // set our choreographers state whenever we read them from the api
  useEffect(() => {
    setChoreographers([...apiChoreographers]);
  }, [getSuccessIndex]);

  // set our modified flag when downloading choregraphers (data)
  // or when add/delete local choreographer list (choreographers)
  useEffect(() => {
      if (apiChoreographers.length !== choreographers.length) {
        setIsModified(true); 
      } else {

        setIsModified(false); 
        for (let i = 0; i < choreographers.length; i++) {
          if (choreographers[i]._id !== apiChoreographers[i]._id) {
            setIsModified(true); 
            break;
          }
        }
      }
  }, [apiChoreographers, choreographers]);

  // reset edit mode and update current data base
  // value (choreographers) is post was successful

  useEffect(() => {
    // skip initial render
    // if not necessary should set to same value
    // and no re-render
    if (postChoreographersSuccessIndex > 0) {
      setEditMode(false);
      setShowSearch(false);
      setApiChoreographers(choreographers);
    }
  }, [postChoreographersSuccessIndex]);

  useEffect(() => {
    // automatically show the search
    // screen when choreo list is empty
    setShowSearch(choreographers.length === 0 && editMode);
  }, [choreographers, editMode]);

  // end hooks
  ///////////////////

  const getTokenAndTryAgain = async () => {
    await getAccessTokenWithPopup(getWatchesConfig);
    getApiChoreographers();
  };

  const getPostTokenAndTryAgain = async () => {
    await getAccessTokenWithPopup(postChoreogrphersConfig);
    getApiChoreographers();
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  const handleSetEditMode = () => {
    getApiChoreographers();
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setShowSearch(false);
    getApiChoreographers();
  }

  const handleSave = () => {
    postChoreographers();
  }

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

    if (!found) {
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
    }
  };

  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          My Watches
        </h1>
        <div className="content__body">
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

                {(isLoading || isSaving) &&
                  <div className="page-layout">
                    <PageLoader />
                  </div>
                }

                {error &&
                  <UseApiShowError error={error} getTokenAndTryAgain={getTokenAndTryAgain} />
                }

                {postError &&
                  <UseApiShowError error={postError} getTokenAndTryAgain={getPostTokenAndTryAgain} />
                }

                {!isLoading && !isSaving && !error && !postError &&
                <div>
                  {!editMode && choreographers?.length === 0 && 
                    <h3 className='my-watches-no-list'>You have no choreographer watches configured.</h3>
                  }

                  {choreographers?.length > 0 &&
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
                        {isModified &&
                          <button className='button button--primary button--compact' onClick={handleSave}>Save</button>
                        }
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
