import React from 'react';
import {withAuthenticationRequired} from "@auth0/auth0-react";
import './my-watches-page.css';
import {useState, useEffect} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {useApi, UseApiShowError} from '../hooks/use-api';
import {usePrevious} from '../hooks/use-previous';
import {PageLayout} from '../components/page-layout';
import {PageLoader} from "../components/page-loader";
import {SearchChoreographer} from '../components/search-choreographer';
import {List, ListItem, ListItemText } from '@mui/material';
import {IconButton, Typography, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

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
  const [pendingEditMode, setPendingEditMode] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
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

  ///////////////////////////////////////////////////////////////////
  // previous states - after all useState calls (some inside useApi)

  const previousGetSuccessIndex = usePrevious(getSuccessIndex);
  const previousPostChoreographersSuccessIndex = usePrevious(postChoreographersSuccessIndex);
  
  // set our choreographers state whenever we read them from the api
  useEffect(() => {
    if (getSuccessIndex !== previousGetSuccessIndex) {
      setEditMode(pendingEditMode);
      setChoreographers([...apiChoreographers]);
    }
  }, [getSuccessIndex, previousGetSuccessIndex, pendingEditMode, apiChoreographers]);

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
  // value (setApiChoreographers) if post was successful

  useEffect(() => {

    if (postChoreographersSuccessIndex !== previousPostChoreographersSuccessIndex) {
      // skip initial render
      // if not necessary should set to same value
      // and no re-render
      if (postChoreographersSuccessIndex > 0) {
        setEditMode(pendingEditMode);
        setApiChoreographers(choreographers);
      }
    }
  }, [postChoreographersSuccessIndex, previousPostChoreographersSuccessIndex, pendingEditMode, choreographers]);

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
    setSearchValue('');
    setShowSearch(true);
  };

  const handleSetEditMode = () => {
    // switch to edit mode after
    // api call completes
    setPendingEditMode(true);
    getApiChoreographers();
  };

  const handleCancel = () => {
    // switch to read mode after
    // api call completes
    setPendingEditMode(false);
    getApiChoreographers();
  }

  const handleSave = () => {
    setPendingEditMode(false);
    postChoreographers();
  }

  const handleDelete = (event) => {

    // we added a user defined attribute (data-index) to the add button
    // to hold the index of the displayed result
    // go up the tree to find the first parent with this property
    // because the ListItemButton has a lot of child elements

    let target = event.target;
    while (target.dataset.index === undefined) {
        target = target.parentElement;
    }

    const index =  parseInt(target.dataset.index);
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

      // we save immediately when adding
      postChoreographers();
    }

    return found === undefined;
  };

  return (
    <PageLayout>
      <Card>
        <CardHeader title='My Watches'
        
          action={
            !isLoading && !isSaving && !error && !postError &&
            <Box sx={{display: 'flex', gap: 1}}>
                {!editMode && getSuccessIndex !== 0 &&
                  <>
                  <Tooltip title='Search Choreographers'>
                  <IconButton color='primary' size='small' variant='outlined' onClick={handleShowSearch}>
                    <SearchIcon fontSize='small' />
                  </IconButton>
                  </Tooltip>
                  <Tooltip title='Edit List'>
                  <IconButton color='primary' size='small' variant='outlined' onClick={handleSetEditMode}>
                    <EditIcon fontSize='small'/> 
                  </IconButton>
                  </Tooltip>
                  </>
                }
                {editMode &&
                  <>
                    {isModified &&
                      <Tooltip title='Save'>
                      <IconButton color='primary' size='small' variant='outlined' onClick={handleSave}>
                        <SaveIcon fontSize='small' />
                      </IconButton>
                      </Tooltip>
                    }
                    <Tooltip title='Cancel'>
                    <IconButton color='primary' size='small'  variant='outlined' onClick={handleCancel}>
                      <CancelIcon fontSize='small' />
                    </IconButton>
                    </Tooltip>
                  </>
                }
              </Box>
          }
        />

        <CardContent>

            {(isLoading || isSaving) &&
              <PageLoader />
            }

            {error &&
              <UseApiShowError error={error} getTokenAndTryAgain={getTokenAndTryAgain} />
            }

            {postError &&
              <UseApiShowError error={postError} getTokenAndTryAgain={getPostTokenAndTryAgain} />
            }

            {!isLoading && !isSaving && !error && !postError && 
            <>
                {/* don't show this until the initial api get completes
                  so it doesn't appear and then disappear after the get api completes */}
                {!editMode && choreographers?.length === 0 && getSuccessIndex !== 0 &&
                  <Typography variant='subtitle1'>
                  You have no choreographer watches configured.
                  </Typography>
                }

                {choreographers?.length > 0 &&
                  <List >
                    {choreographers.map((choreographer, index) => {
                      return (
                        <ListItem key={choreographer._id}>
                          <Tooltip title='Delete'>
                            <IconButton size='small'
                                color='info'
                                sx={{visibility: editMode ? 'visible' : 'collapse'}}
                                data-index={index}
                                onClick={handleDelete}>
                                  <DeleteIcon fontSize='medium'/>
                            </IconButton>
                          </Tooltip>
                          <ListItemText primary={choreographer.name} />
                        </ListItem>  
                      );
                    })}
                  </List>
                }

              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showSearch}
                onClick={handleCloseSearch}
              >
                <SearchChoreographer
                  handleClose={handleCloseSearch}
                  handleAdd={handleAddWatch}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  choreographers={choreographers}
                  showSearch={showSearch}
                  />
              </Backdrop>
            </>
          }
          </CardContent>
      </Card>
    </PageLayout>
  );
};

const ProtectedMyWatchesPage = withAuthenticationRequired(MyWatchesPage, {
  onRedirecting: () => <PageLoader />,
  returnTo: '/my-watches',
});

export {ProtectedMyWatchesPage};
