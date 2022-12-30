import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import axios from 'axios';
import { PageLoader } from "./components/page-loader";
import { ProtectedAdminPage } from "./pages/admin-page";
import { CallbackPage } from "./pages/callback-page";
import { HomePage } from "./pages/home-page";
import { NotFoundPage } from "./pages/not-found-page";
import { LoginDeniedPage } from "./pages/login-denied-page";
import { ProtectedProfilePage } from "./pages/profile-page";
import { PublicPage } from "./pages/public-page";
import {ProtectedMyWatchesPage} from './pages/my-watches-page';


const App = () => {

  const navigate = useNavigate();
  const {error, logout, isLoading, user: auth0User, isAuthenticated} = useAuth0();
  const [user, setUser] = useState(undefined);  // mongoose user

  useEffect(() => {

    // this happens when our Login action in auth0
    // denys a login for an unverified email user

    if (!isLoading && !isAuthenticated && error) {

      // TOOD: find a better way to do this
      // alert(error.message);

      // we may be able to make a new page to show the
      // error and pass the page url to the logoutOptions
      // also after register the url in auth0
      const returnTo = process.env.REACT_APP_AUTH0_LOGIN_DENIED_URL;
      const logoutOptions = {returnTo: returnTo};
      logout(logoutOptions);
    }
  }, [isAuthenticated, isLoading, error]);

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const baseUrl = 'https://api.tomwood2.com/';
        const url = `${baseUrl}monitor/user/email/${auth0User.email}`;
        const result = await axios.get(url);
        setUser(result.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (auth0User === undefined) {
      setUser(null);
    } else {
      fetchUser();
    }
  }, [auth0User]);

  if (isLoading) {
    return (
      <div className="page-layout">
        <PageLoader />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProtectedProfilePage />} />
      <Route path="/public" element={<PublicPage />} />
      <Route path="/my-watches" element={<ProtectedMyWatchesPage />} />
      <Route path="/admin" element={<ProtectedAdminPage />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/login-denied" element={<LoginDeniedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
