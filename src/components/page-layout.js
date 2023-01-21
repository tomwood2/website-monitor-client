import React from "react";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

// import { NavBar } from "./navigation/desktop/nav-bar";
// import { MobileNavBar } from "./navigation/mobile/mobile-nav-bar";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

const title = 'Choreographer Watch';

// const pages = ['Public', 'My Watches', 'Admin'];

const pages = [
  {title: 'Public', route: '/public' },
  {title: 'My Watches', route: '/my-watches', authenticatedOnly: true },
  {title: 'Admin', route: '/admin', authenticatedOnly: true },
  {title: 'Sign Up', mobileOnly: true, function: 'signup', unauthenticedOnly: true },
  {title: 'Log In', mobileOnly: true, function: 'login', unauthenticedOnly: true },
];

const userMenuItems = [
  {title: 'Profile', route: '/profile'},
  {title: 'Logout',},
];

export const PageLayout = ({ children }) => {
  // return (
  //   <div className="page-layout">
  //     <NavBar />
  //     <MobileNavBar />
  //     <div className="page-layout__content">{children}</div>
  //   </div>
  // );
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleSignUp = async () => {
    await loginWithRedirect({
      screen_hint: "signup",
      appState: { returnTo: "/profile", },
    });
  };

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: { returnTo: "/profile", },
    });
  };
  
  const handleLogout = () => {
    logout({
      returnTo: window.location.origin,
    });
  };

  // called when hamburger menu button (mobile) is clicked
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  // called when avatar clicked (mobile and non-mobile) to show user menut
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // called when nav button (non-mobile) or nav menu item (mobile) is selected
  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null);
    if (page.route) {
      navigate(page.route);
    } else if (page.function === 'signup') {
      handleSignUp();
    } else if (page.function === 'login') {
      handleLogin();
    }
  };

  // called when menu item under avatar is selected
  const handleCloseUserMenu = (userMenuItem) => {
    setAnchorElUser(null);
    if (userMenuItem.route) {
      navigate(userMenuItem.route);
    } else {
      handleLogout();
    }
  };

  
  return (
    <Box>
      <AppBar position="static" color='info'>
        <Container maxWidth="xl">
          <Toolbar disableGutters>

            {/* non-mobile (app title and logo) */}
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                // fontFamily: 'monospace',
                fontWeight: 700,
                // letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {title}
            </Typography>

            {/* mobile (hamburger with nav menu) */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={() => handleCloseNavMenu(() => handleCloseNavMenu(null))}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
              {pages.filter(page =>
                  (!page.unauthenticedOnly || (page.unauthenticedOnly && !isAuthenticated)) &&
                  (!page.authenticatedOnly || (page.authenticatedOnly && isAuthenticated)))
                .map(page => {
                  return (
                    <MenuItem key={page.title} onClick={() => handleCloseNavMenu(page)}>
                      <Typography textAlign="center">{page.title}</Typography>
                    </MenuItem>
                  );
              })
              }

              </Menu>
            </Box>

            {/* mobile (logo and app title) */}
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                // fontFamily: 'monospace',
                fontWeight: 700,
                // letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {title}
            </Typography>

            {/* non-mobile (nav buttons) */}
            <Box sx={{ mr: 1, flexGrow: 1, justifyContent: "flex-end", display: { xs: 'none', md: 'flex' } }}>
              {pages.filter(page =>
                !page.mobileOnly &&
                  ((page.authenticatedOnly && isAuthenticated) || !page.authenticatedOnly))
                .map(page => {
                  return (
                    <Button
                      key={page.title}
                      sx={{ my: 2, display: 'block', color: 'white' }}
                      onClick={() => handleCloseNavMenu(page)}
                    >
                      {page.title}
                    </Button>
                    );
              })}
            </Box>

            {/* non-mobile only when not logged in (signup and login buttons) */}
            {!isAuthenticated && (
              <Box sx={{ display: {xs: 'none', md: 'flex' }, gap: 1 }}>
                <Button variant="outlined" sx={{ flexGrow: 0, color: 'white', borderColor: 'white' }} onClick={handleSignUp}>
                  Sign Up
                </Button>
                <Button variant="contained" sx={{ flexGrow: 0 }} onClick={handleLogin}>
                  Log In
                </Button>
              </Box>
            )}

            {/* mobile & non-mobile when logged in (avatar with user menu items) */}
            {isAuthenticated && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={user.picture} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {userMenuItems.map((userMenuItem) => (
                  <MenuItem key={userMenuItem.title} onClick={() => handleCloseUserMenu(userMenuItem)}>
                    <Typography textAlign="center">{userMenuItem.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ m: 5 }}>
        {children}
      </Box>
    </Box>

  );
};
