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
  const { user } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [message, setMessage] = useState('');
  const [items, setItems] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() =>  {

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


  const updateMessage = (event) => {
    setMessage(event.target.value);
  };

  const onAddItem = () => {
    setItems((items) => {
      items.push(message);
      return items;
    })
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  const handleSetEditMode = () => {
    setEditMode(true);
  };

  const handleUnsetEditMode = () => {
    setEditMode(false);
    handleCloseSearch();
  };

  const handleAddWatch = () => {
    console.log("handleAddWatch");
  };

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
          {/* <p id="page-description">
          <span>
              Below is the list of choreogrphers that you are watching for new line dances.
          </span>
          </p> */}
            <div className="my-watches-grid">
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
              <div className="my-watches-list">

              {data.userSites.map((userSite) => {
                return (
                  <>
                    {editMode &&
                      <div className='my-watches-list-cell'>
                          <button className='button button--compact button--secondary my-watches-delete-button' >Delete</button>
                      </div>
                    }

                    {/* this is the first column when not it edit mode */}
                    <div className='my-watches-list-cell'>
                      {userSite.name}
                    </div>
                    <div className='my-watches-list-cell'>
                        <button className='button button--compact button--secondary my-watches-dummy-button' >dummy</button>
                    </div>
                    
                    {/* we still want 3 columns when not in edit mode */}

                    {!editMode &&
                      <div></div>
                    }
                  </>
                )
                })}
              </div>

              <div className='my-watches-button-bar'>
                {!editMode &&
                  <button className='button button--primary button--compact' onClick={handleSetEditMode}>Edit</button>
                }
                {editMode &&
                  <>
                    <button className='button button--primary button--compact' onClick={handleUnsetEditMode}>Save</button>
                    <button className='button button--primary button--compact' onClick={handleUnsetEditMode}>Cancel</button>
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

/*
      <div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {renderRows()}
        </tbody>
      </table>
      <hr/>
      <input type="text" onChange={updateMessage}/>
      <button onClick={onAddItem}>
        Add Item
      </button>
      </div>

*/


/*
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          My Watches
        </h1>
        <div className="content__body">
          <p id="page-description">
          <span>
              Below is the list of choreogrphers that you are watching for new line dances.
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
  */

