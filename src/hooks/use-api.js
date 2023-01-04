// from https://github.com/auth0/auth0-react/blob/master/EXAMPLES.md#create-a-useapi-hook-for-accessing-protected-apis-with-an-access-token
// only use on protected pages - pages that can only be seen by logged in users
// changes from original : use axios instead of fetch so no await on result.data, loading now isLoading
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

export const useApi = (url, options = {}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [state, setState] = useState({
    error: null,
    isLoading: true,
  });
  const [data, setData] = useState(null);   // only used to trigger render
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { audience, scope, ...fetchOptions } = options;
        const accessToken = await getAccessTokenSilently({ audience, scope });

        const result = await axios.get(url, {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            // Add the Authorization header to the existing headers
            Authorization: `Bearer ${accessToken}`,
          },
        });
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
    data,
    setData,    // so we can use like state in caller
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
