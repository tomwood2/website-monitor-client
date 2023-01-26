// from https://github.com/auth0/auth0-react/blob/master/EXAMPLES.md#create-a-useapi-hook-for-accessing-protected-apis-with-an-access-token
// only use on protected pages - pages that can only be seen by logged in users
// changes from original : use axios instead of fetch so no await on result.data, loading now isLoading
// added callApiOnFirstRender to make it more flexible

// pass setData as arg

import {useEffect, useState} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import axios from 'axios';
import { usePrevious } from './use-previous';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


export const useApi = (setData, config = {}, callApiOnFirstRender = true) => {

  const {getAccessTokenSilently} = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [apiSuccessIndex, setApiSuccessIndex] = useState(0);

  const previousRefreshIndex = usePrevious(refreshIndex);

  useEffect(() => {

    if (refreshIndex === previousRefreshIndex) {
      return;
    }

    // only call api in response to refreshIndex
    // call (skip api on first render)
    // if callApiOnFirstRender is true
    // set to false when only want call api in
    // response to user input only for example.
    if (!callApiOnFirstRender && refreshIndex === 0) {
      return;
    }

    // don't indicate we are reading
    // to the user until we are waiting
    // more than 500ms
    const timerId = setTimeout(() => {
      setIsLoading(true)}
      , 500);

    (async () => {
      try {
        const { audience, scope, ...configOptions } = config;
        const accessToken = await getAccessTokenSilently({ audience, scope });

        const result = await axios({
          ...configOptions,
          headers: {
            ...configOptions.headers,
            // Add the Authorization header to the existing headers
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setApiSuccessIndex(oldIndex => ++oldIndex);
        setData(result.data);

        clearTimeout(timerId);
        setIsLoading(false);
        setError(null);

      } catch (error) {
        clearTimeout(timerId);
        setIsLoading(false);
        setError(error);
      }
    })();
  }, [refreshIndex, callApiOnFirstRender, config, getAccessTokenSilently, previousRefreshIndex, setData]);

  return {
    isLoading,
    error,
    apiSuccessIndex,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};

export const UseApiShowError = ({error, getTokenAndTryAgain}) => {

  if (error?.error === 'consent_required') {
    return (
      <Box>
        <Typography variant='h4'>You must authorize this application to continue.</Typography>
        <Button color='primary' variant='contained' onClick={getTokenAndTryAgain}>View Authorization Form</Button>
      </Box>
      );
  }

  if (error?.message) {
    return (
      <Box>
        <Typography variant='h4'>Oops {error.message}!</Typography>
      </Box>
    );
  }

  return (<Box></Box>);
};
