// from https://github.com/auth0/auth0-react/blob/master/EXAMPLES.md#create-a-useapi-hook-for-accessing-protected-apis-with-an-access-token
// only use on protected pages - pages that can only be seen by logged in users
// changes from original : use axios instead of fetch so no await on result.data, loading now isLoading
// added callApiOnFirstRender to make it more flexible

// pass setData as arg

import {useEffect, useState} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import axios from 'axios';

export const useApi = (setData, config = {}, callApiOnFirstRender = true) => {
  const {getAccessTokenSilently} = useAuth0();
  const [state, setState] = useState({
    error: null,
    isLoading: callApiOnFirstRender ? true : false,
  });
  // only used to trigger render
  const [refreshIndex, setRefreshIndex] = useState(0);
  // only used to allow caller to run effect every time api call succeeds
  const [apiSuccessIndex, setApiSuccessIndex] = useState(0);

  useEffect(() => {
    // only call api in response to refreshIndex
    // call (skip api on first render)
    // if callApiOnFirstRender is true
    // set to false when only want call api in
    // response to user input only for example.
    if (!callApiOnFirstRender && refreshIndex === 0) {
      return;
    }

    setState({
      ...state,
      isLoading: true,
    });

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
        setState({
          ...state,
          error: null,
          isLoading: false,
        });

      } catch (error) {
        setState({
          ...state,
          error,
          isLoading: false,
        });
      }
    })();
  }, [refreshIndex]);

  return {
    ...state,
    // data,
    // setData,    // so we can use like state in caller
    apiSuccessIndex,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};

export const UseApiShowError = ({error, getTokenAndTryAgain}) => {

  if (error?.error === 'consent_required') {
    return (
      <div className='my-watches-error-panel'>
        <h2 className="content__title">You must authorize this application to continue.</h2>
        <button className='button button--primary button--compact' onClick={getTokenAndTryAgain}>View Authorization Form</button>
      </div>
      );
  }

  if (error?.error) {
    return (
      <div className='my-watches-error-panel'>
        <h2 className="content__title">Oops {error.message}!</h2>
      </div>
    );
  }

  return (<div></div>);
};
