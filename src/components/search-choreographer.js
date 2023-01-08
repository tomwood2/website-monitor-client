import React from "react";
import {useState, useEffect} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApi, UseApiShowError } from '../hooks/use-api';
import { PageLoader } from "../components/page-loader";

const SearchChoreographer = ({handleClose, handleAdd}) => {

    ///////////////////
    // constants

    const baseUrl = 'https://api.tomwood2.com/';

    ///////////////////
    // begin hooks

    const {getAccessTokenWithPopup} = useAuth0();
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState(null)

    const config = {
        audience: 'api.tomwood2.com',
        scope: undefined,  
        method: 'get',
        url: `${baseUrl}monitor/site/searchChoreographers/${searchValue}`,  
    }

    // read choreographers from protected api only when we call refreshSearchResult
    const {isLoading, error, refresh: refreshSearchResult } =
        useApi(setSearchResult, config, false);

    // if we include setSearchResult and refreshSearchResult
    // in the change array we get calls to the effect on every
    // render
    useEffect(() => {
        if (searchValue === '') {
            setSearchResult(null);
        } else {
            refreshSearchResult();
        }
    }, [searchValue]);

    // end hooks
    ///////////////////
    
    const getTokenAndTryAgain = async () => {
        await getAccessTokenWithPopup(config);
        refreshSearchResult();
    };
    
    const onSearchValueChange = (event) => {
        setSearchValue(event.target.value);
    }

    const onClickAdd = (event) => {

        // we added a user defined attribute (data-index) to the add button
        // to hold the index of the displayed result
        const index =  parseInt(event.target.dataset.index);
        const choreographer = searchResult.matches[index];
        handleAdd(choreographer);
    }

    return (

        <div className="search-choreographers">
            <div className='search-choreographers-title-bar'>
                <span className="search-choreographers-title">Choreogrpher Search</span>
                <button className='button__logout' onClick={handleClose}>Close</button>
            </div>
            <div className="code-snippet__container">
                <div className="search-choreographers-content">

                    <div className='search-choreographers-search-controls-container'>
                        <label className='search-chroeographers-search-label' htmlFor="header-search">
                            <span>Search For:</span>
                        </label>
                        <input
                            className='search-chroeographers-search-input'
                            type="text"
                            id="header-search"
                            placeholder="partial last name[,partial first name]"
                            value={searchValue}
                            onChange={onSearchValueChange}
                        />
                    </div>

                    <div className='search-choreographers-results-list'>

                        {isLoading &&
                        <div className="page-layout">
                            <PageLoader />
                        </div>
                        }

                        {error &&
                        <UseApiShowError error={error} getTokenAndTryAgain={getTokenAndTryAgain} />
                        }

                        {!isLoading && !error && searchResult &&
                            searchResult.matches.map((choreographer, index) => {
                            return (
                                <div className='search-choreographers-results-list-row'
                                    key={choreographer._id}>
                                    <button
                                        className='button button--compact button--secondary search-choreographers-results-add-button'
                                        onClick={onClickAdd}
                                        data-index={index}>
                                        Add
                                    </button>
                                <div className="search-choreographers-results-list-cell">
                                    {`${choreographer.name}`}
                                </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );

};

export {SearchChoreographer};