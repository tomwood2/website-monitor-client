import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { PageLoader } from "./components/page-loader";
import { ProtectedAdminPage } from "./pages/admin-page";
import { CallbackPage } from "./pages/callback-page";
import { HomePage } from "./pages/home-page";
import { NotFoundPage } from "./pages/not-found-page";
import { ProtectedProfilePage } from "./pages/profile-page";
import { PublicPage } from "./pages/public-page";
import { ProtectedMyWatchesPage } from './pages/my-watches-page';


const App = () => {

  const { isLoading } = useAuth0();

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
    typography: {
      fontSize: 16,
      // Tell MUI what's the font-size on the html element is.
      htmlFontSize: 16,
      button: {
        textTransform: 'none'
      }
    }
  });

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <div className="page-layout">
        <PageLoader />
      </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProtectedProfilePage />} />
      <Route path="/public" element={<PublicPage />} />
      <Route path="/my-watches" element={<ProtectedMyWatchesPage />} />
      <Route path="/admin" element={<ProtectedAdminPage />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </ThemeProvider>
  );
};

export default App;
