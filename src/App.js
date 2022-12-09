import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Route, Routes } from "react-router-dom";
import { PageLoader } from "./components/page-loader";
import { ProtectedAdminPage } from "./pages/admin-page";
import { CallbackPage } from "./pages/callback-page";
import { HomePage } from "./pages/home-page";
import { NotFoundPage } from "./pages/not-found-page";
import { ProtectedProfilePage } from "./pages/profile-page";
import { PublicPage } from "./pages/public-page";
import {ProtectedMyWatchesPage} from './pages/my-watches-page';

const App = () => {

  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="page-layout">
        <PageLoader />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" exact element={<HomePage />} />
      <Route path="/profile" element={<ProtectedProfilePage />} />
      <Route path="/public" element={<PublicPage />} />
      <Route path="/my-watches" element={<ProtectedMyWatchesPage />} />
      <Route path="/admin" element={<ProtectedAdminPage />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
