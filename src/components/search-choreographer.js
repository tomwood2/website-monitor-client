import React from "react";
import {useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import { useApi, UseApiShowError } from '../hooks/use-api';
import { PageLoader } from "../components/page-loader";
import {usePrevious} from '../hooks/use-previous';

const SearchChoreographer = ({handleClose, handleAdd, searchValue, setSearchValue, choreographers, showSearch}) => {

    ///////////////////
    // constants

    const baseUrl = 'https://api.tomwood2.com/';

    ///////////////////
    // begin hooks

    const {getAccessTokenWithPopup} = useAuth0();
    const [searchResult, setSearchResult] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);
    const [popererText, setPopoverText] = useState('popover text');
    const popoverTimerId = useRef(-1);
    const apiCallDelayTimerId = useRef(-1);
    const searchValueElement = useRef(null);

    ///////////////////////////////////////////////////////////////////
    // previous states - after all useState calls (some inside useApi)

    const previousSearchValue = usePrevious(searchValue);
  
    const handleAddPopoverClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);

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
        if (searchValue !== previousSearchValue) {
            if (searchValue === '') {
                setSearchResult(null);
            } else {
                // Delay calling in case we get
                // another change immediately after this one

                clearTimeout(apiCallDelayTimerId.current);
                apiCallDelayTimerId.current = setTimeout(() => { console.log("calling refresh"); refreshSearchResult(); }, 300);
            }
        }
    }, [previousSearchValue, searchValue, refreshSearchResult]);

    useEffect(() => {
        // set focus to the search value input control
        // whenever this component becomes visible
        if (showSearch && searchValueElement.current) {
            searchValueElement.current.focus();
        }
    }, [showSearch]);

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
        // go up the tree to find the first parent with this property
        // because the ListItemButton has a lot of child elements

        let target = event.target;
        while (target.dataset.index === undefined) {
            target = target.parentElement;
        }

        const index =  parseInt(target.dataset.index);
        const choreographer = searchResult.matches[index];
        const added = handleAdd(choreographer);
        if (added) {
            // kill old timer in case it is still running
            clearTimeout(popoverTimerId.current);
            setPopoverText(`${choreographer.name} has been added.`);
            setAnchorEl(event.currentTarget);
            popoverTimerId.current = setTimeout(() => { setAnchorEl(null); popoverTimerId.current = -1; }, 2000);
        }
    }

    const handleClearSearchValue = () => setSearchValue('');
    // close the search on escape key press
    const handleKeyDown = (event) => {
        if (event.code === 'Escape') {
            handleClose();
        }
    };

    // The Backdrop is sized to the entire viewport
    // The Card is set to 80% of the Backdrop
    // The CardHeader's height is set to its intrisic height (no flexGrow)
    // the CardContent height is the Card's height minus the CardHeader height (flexGrow: 1)
    // the list is 100% of the height of the CardContent
    // we scroll the CardContent vertially if the List overflows

    return (
        <Card sx={{ width: '80%', height: '80%', display: 'flex', flexDirection: 'column' }}
            onKeyDown={handleKeyDown}
            onClick={(event) => event.stopPropagation() }>

        <CardHeader sx={{ pb: 0 }}
            action={
                <Tooltip title='Close Search'>
                    <IconButton size='small' aria-label="close search" onClick={handleClose}>
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
            }
            subheader={
                <TextField
                    fullWidth
                    autoComplete='off'
                    id="search-for"
                    label='Search Choreographers'
                    helperText="partial last name[,partial first name]"
                    variant="filled"
                    value={searchValue}
                    onChange={onSearchValueChange}
                    inputRef={searchValueElement}
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="end">
                                <Tooltip title='Clear'>
                                <IconButton
                                    aria-label="clear search value"
                                    onClick={handleClearSearchValue}
                                    edge="end"
                                    disabled={searchValue === ''}
                                >
                                    <ClearIcon sx={{fontSize: 'small', visibility: searchValue === '' ? 'hidden' : 'visible'}} />
                                </IconButton>
                                </Tooltip>
                            </InputAdornment>,
                        startAdornment:
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        }
                    }
                />
            }
          />

        <CardContent sx={{ flexGrow: 1, overflowY: 'auto', }}>

            {isLoading &&
            <PageLoader />
            }

            {error &&
            <UseApiShowError error={error} getTokenAndTryAgain={getTokenAndTryAgain} />
            }

            {!isLoading && !error &&
            <List sx={{ height: '100%' }}>
                { searchResult &&
                    searchResult.matches.map((choreographer, index) => {
                    return (

                    <ListItem key={choreographer._id} sx={{pb: 0}}>
                        <ListItemButton disabled={choreographers.find(c => c._id === choreographer._id)} data-index={index} onClick={onClickAdd}>
                            <ListItemIcon>
                                <AddBoxIcon />
                            </ListItemIcon>
                            <ListItemText primary={choreographer.name}>
                            </ListItemText>
                        </ListItemButton>
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleAddPopoverClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <Typography sx={{ p: 2 }}>{popererText}</Typography>
                        </Popover>

                    </ListItem>
                    )
                })}
            </List>
            }

        </CardContent>
        {/* <CardActions>
          <Button size="small" onClick={handleClose} >Close</Button>
        </CardActions> */}
        </Card>
    //   </Box>
    );

};

export {SearchChoreographer};