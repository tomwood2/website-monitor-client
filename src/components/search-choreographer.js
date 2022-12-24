import React from "react";
import axios from 'axios';
import {useState, useEffect} from 'react';

// export const SearchChoreographer = () => {

//   return (
//     <div>Choreogrpher search</div>
//   );
// };

const SearchChoreographer = ({handleClose, handleAdd}) => {

    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    useEffect(() =>  {

        if (searchValue === '') {
            setSearchResult(null);
            return;
        }

        const baseUrl = 'https://api.tomwood2.com/';
        const url = `${baseUrl}monitor/site/searchChoreographers/${searchValue}`;
    
        const fetchData = async () => {
    
            setLoading(true);
    
            try {
                const response = await axios.get(url);
                setSearchResult(response.data);
            } catch (error) {
                console.error(error.message);
            }
    
            setLoading(false);
        }
    
        fetchData();
    
    }, [searchValue]);

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

    // if (loading) {
    //     return (<div>Loading</div>)
    // }

    const ui = (

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
                    { searchResult && 
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
)
    //     <label htmlFor="header-search">
    //         <span>Add more:</span>
    //     </label>
    //     <input
    //         type="text"
    //         id="header-search"
    //         placeholder="Search choreographers"
    //         value={searchValue}
    //         onChange={onSearchValueChange}
    //     />

    //     { searchResult && 
    //         searchResult.matches.map((choreographer) => {
    //         return (
    //             <div className='content__row' key={choreographer._id}>
    //             <div className='content__column'>
    //             {`${choreographer.lastName}, ${choreographer.firstName}`}
    //             </div>
    //             <div className='content__column'>
    //                 <button className='button button--compact button--secondary content__delete__button' >Add</button>
    //             </div>
    //             </div>
    //         )
    //         })}

    // </div>);

    return ui;
        
};

export {SearchChoreographer};