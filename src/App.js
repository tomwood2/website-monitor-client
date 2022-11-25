import React from 'react';
import {Routes, Route} from "react-router-dom";

import './App.css';
import AuthProvider from './components/AuthProvider';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import RequireAuth from './components/RequireAuth';
import UserWatches from './components/UserWatches';

// function App() {
//   return (
//     <UserWatches />
//   );
// }

function HomePage() {
  return <h3>Welcome to the Home Page!</h3>;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}

function App() {
  return (
    <AuthProvider>
      <h1>Follow Line Dance Choreographers</h1>

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <UserWatches />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
