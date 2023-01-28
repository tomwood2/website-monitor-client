import React, { useRef } from "react";
import {useState, useEffect} from 'react';
import {withAuthenticationRequired} from "@auth0/auth0-react";
import {useAuth0} from "@auth0/auth0-react";
import {useApi, UseApiShowError} from '../hooks/use-api';
import {usePrevious} from '../hooks/use-previous';

import {PageLayout} from "../components/page-layout";
import {PageLoader} from "../components/page-loader";
import {LeavePageDialog} from '../components/leave-page-dialog';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

///////////////////
// constants

const baseUrl = 'https://api.tomwood2.com/';

const subFields = [
  {label: 'Pushover User:', propertyName: 'pushover.user', type: 1 },
  {label: 'Pushover Device:',  propertyName: 'pushover.device', type: 1 },
];

const fields = [
  {label: 'First Name:', propertyName: 'firstName', type: 1 },
  {label: 'Last Name:', propertyName: 'lastName', type: 1  },
  {label: 'Email Notify:', propertyName: 'emailNotify', type: 2  },
  {label: 'Pushover Notify:', propertyName: 'pushover', type: 3, default: {user: '', device: ''} },
];

const allFields = [...fields, ...subFields];

const ProfilePage = () => {

  ///////////////////
  // begin hooks

  const {user: auth0User, getAccessTokenWithPopup } = useAuth0();
  const [apiUser, setApiUser] = useState(null);
  const [user, setUser] = useState(null);
  const [, setPostUserResult] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [pendingEditMode, setPendingEditMode] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [formErrors, setFormErrors] = useState(null);

  const firstNameElement = useRef();

  const userId = auth0User['https://tomwood2.com/_id']; // funky property name

  const getApiUserConfig = {
    audience: 'api.tomwood2.com',
    scope: undefined,
    method: 'get',
    url: `${baseUrl}users/id/${userId}`,  
  }

  const setApiUserHook = (apiUser) => {

    // we don't want to include __v, _id and pushover._id
    // because it causes issues when comparing apiUser and user
    let newApiUser = {
      firstName: apiUser.firstName,
      lastName: apiUser.lastName,
      emailNotify: apiUser.emailNotify,
    }

    if (apiUser.pushover !== undefined) {
      newApiUser.pushover = {
        user: apiUser.pushover.user,
        device: apiUser.pushover.device,
      }
    }

    setApiUser(newApiUser);
  };

  // read apiUser
  const {isLoading, error, apiSuccessIndex: getApiUserSuccessIndex, refresh: getApiUser } =
    useApi(setApiUserHook, getApiUserConfig);

  const postUserConfig = {
    audience: 'api.tomwood2.com',
    scope: undefined,
    method: 'post',
    url: `${baseUrl}users/id/${userId}`,
    data: user,
  }

  // post user
  const {isLoading: isSaving, error: postError, apiSuccessIndex: postUserSuccessIndex, refresh: postUser } =
    useApi(setPostUserResult, postUserConfig, false);

  ///////////////////////////////////////////////////////////////////
  // previous states - after all useState calls (some inside useApi)

  const previousGetApiUserSuccessIndex = usePrevious(getApiUserSuccessIndex);
  const previousPostUserSuccessIndex = usePrevious(postUserSuccessIndex);
  
  // set user whenever we read it from the apiUser
  useEffect(() => {
    if (getApiUserSuccessIndex !== previousGetApiUserSuccessIndex &&
      getApiUserSuccessIndex > 0) {
      setEditMode(pendingEditMode);
      setUser(JSON.parse(JSON.stringify(apiUser)));   // deep copy
      setFormErrors(null);
    }
  }, [getApiUserSuccessIndex, previousGetApiUserSuccessIndex, pendingEditMode, apiUser]);

  // set our modified flag when downloading apiUser
  // or when modifying local user object (user)
  useEffect(() => {

    const isObject = (value) => value &&
      typeof value === 'object' &&
      value.constructor === Object;

    const deepEqual = (obj1, obj2) => {
      const propertyNames1 = Object.getOwnPropertyNames(obj1);
      const propertyNames2 = Object.getOwnPropertyNames(obj2);

      if (propertyNames1.length !== propertyNames2.length) {
        return false;
      }

      for (let i = 0; i < propertyNames1.length; i++) {

        if (propertyNames1[i] !== propertyNames2[i]) {
          return false;
        }

        const obj1Value = obj1[propertyNames1[i]];
        const obj2Value = obj2[propertyNames1[i]];

        if (isObject(obj1Value)) {

          if (!deepEqual(obj1Value, obj2Value)) {
            return false;
          }

          continue;
        }

        if (obj1Value !== obj2Value) {
          return false;
        }
      }

      return true;
    };

    if (getApiUserSuccessIndex === 0 || user === null) {
      setIsModified(false); // didn't update properties yet
    } else {
      setIsModified(!deepEqual(user, apiUser));
    }
  }, [apiUser, user]);

  // set/reset form errors whenever user changes
  useEffect(() => {

    if (user) {

      let formErrors = null;

      (user.pushover ? allFields : fields).forEach((field) => {
        if (field.type === 1) {
          const value = getUserProperty(field);
          if (!value || value === '') {
            // found error
            if (formErrors === null) {
              formErrors = {};
            }
            formErrors[field.propertyName] = 'Invlaid entry';
          }
        }
      });

      setFormErrors(formErrors);
    }
  }, [user]);

  // reset edit mode and update current data base
  // value (setApiUser) if post was successful
  useEffect(() => {

    if (postUserSuccessIndex !== previousPostUserSuccessIndex) {
      // skip initial render
      // if not necessary should set to same value
      // and no re-render
      if (postUserSuccessIndex > 0) {
        setEditMode(pendingEditMode);
        setApiUser(user);
      }
    }
  }, [postUserSuccessIndex, previousPostUserSuccessIndex, pendingEditMode, user]);

  useEffect(() => {
    // set focus to the first name input control
    // whenever we enter editMode
    if (editMode && firstNameElement.current) {
      firstNameElement.current.focus();
    }
  }, [editMode]);

  // end hooks
  ///////////////////

  const getTokenAndTryAgain = async () => {
    await getAccessTokenWithPopup(getApiUserConfig);
    getApiUser();
  };

  const getPostTokenAndTryAgain = async () => {
    await getAccessTokenWithPopup(postUserConfig);
    postUser();
  };

  const handleSetEditMode = () => {
    // switch to edit mode after
    // api call completes
    setPendingEditMode(true);
    getApiUser();
  };

  const handleCancel = () => {
    // switch to read mode after
    // api call completes
    setPendingEditMode(false);
    getApiUser();
  };

  const handleSave = () => {
    setPendingEditMode(false);
    postUser();
  };

  const getUserProperty = (field) => {
    if (user === null) {
      return field.type === 1 ? '' : false;
    }

    const propertyNameParts = field.propertyName.split('.');

    let value = user[propertyNameParts[0]];

    if (propertyNameParts.length > 1) {
      // property of an object property
      if (value) {
        value = value[propertyNameParts[1]];
      } else {
        return field.type === 1 ? '' : false;
      }
    }

    if (field.type === 3) { // object as bool
      return value === undefined ? false : true;
    }

    return value;
  };

  const setUserProperty = (field, target) => {

    let newUser = {...user};
    const propertyNameParts = field.propertyName.split('.');

    let propertyName = propertyNameParts[0];
    let modifyObject = newUser;

    if (propertyNameParts.length === 2) {
      modifyObject = newUser[propertyNameParts[0]];
      propertyName = propertyNameParts[1];
    }

    if (field.type === 1) {
      modifyObject[propertyName] = target.value;
    } else if (field.type === 2) {
      modifyObject[propertyName] = target.checked;
    } else if (field.type === 3) {
      if (target.checked) {
        modifyObject[propertyName] = {...field.default};
      } else {
        delete modifyObject[propertyName];
      }
    }

    setUser(newUser);
  };

  return (
    <PageLayout>
      <LeavePageDialog isModified={isModified}/>
      <Card>
        <CardHeader title='My Profile' subheader={(<span>{apiUser ? (apiUser.firstName + ' ' + apiUser.lastName) : auth0User.name}<br/>{auth0User.email}</span>)}
          action={
            !isLoading && !isSaving && !error && !postError &&
            <Box sx={{display: 'flex', gap: 1}}>
            {!editMode && getApiUserSuccessIndex !== 0 &&
              <>
              <Tooltip title='Edit'>
              <IconButton color='primary' size='small'
                variant='outlined' onClick={handleSetEditMode}>
                <EditIcon fontSize='small'/> 
              </IconButton>
              </Tooltip>
              </>
            }
            {editMode &&
              <>
                {isModified && formErrors === null &&
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
          }>
        </CardHeader>
        <CardContent>

            {(isLoading || isSaving || getApiUserSuccessIndex === 0) &&
              <PageLoader />
            }

            {error &&
              <UseApiShowError error={error} getTokenAndTryAgain={getTokenAndTryAgain} />
            }

            {postError &&
              <UseApiShowError error={postError} getTokenAndTryAgain={getPostTokenAndTryAgain} />
            }

            {!isLoading && !isSaving && !error && !postError && user &&
            <Box>
              {(user.pushover ? allFields : fields).map((field, index) => {
                return (
                  <Grid item container xs={12} key={index}>
                  <Grid item xs={3} display='flex' alignItems={'center'}>
                    <Typography>
                      {field.label}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    {(field.type === 2 || field.type === 3) &&
                      <Switch
                        sx = {{mb: 1, mt: 1}}
                        disabled = {!editMode}
                        checked = {getUserProperty(field)}
                        onChange={(event) => setUserProperty(field, event.target)}
                      />
                    }
                    {field.type === 1 &&
                      <TextField
                        inputRef={index === 0 ? firstNameElement : null}
                        variant='outlined'
                        fullWidth
                        label={editMode ? 'Required' : ''}
                        required
                        disabled = {!editMode}
                        margin='dense'
                        error={formErrors && formErrors[field.propertyName]}
                        helperText={formErrors && formErrors[field.propertyName] ? formErrors[field.propertyName] : ''}
                        value={getUserProperty(field)}
                        onChange={(event) => setUserProperty(field, event.target)}
                        />
                    }
                  </Grid>
                  </Grid>
                );
              })
              }

            </Box>
            }
        </CardContent>
      </Card>

    </PageLayout>
  );
};

const ProtectedProfilePage = withAuthenticationRequired(ProfilePage, {
  onRedirecting: () => <PageLoader />,
  returnTo: '/profile',
});

export {ProtectedProfilePage};
