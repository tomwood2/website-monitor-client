import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Route, Switch } from "react-router-dom";
import { PageLoader } from "./components/page-loader";
import { ProtectedRoute } from "./components/protected-route";
import { AdminPage } from "./pages/admin-page";
import { CallbackPage } from "./pages/callback-page";
import { HomePage } from "./pages/home-page";
import { NotFoundPage } from "./pages/not-found-page";
import { ProfilePage } from "./pages/profile-page";
import { ProtectedPage } from "./pages/protected-page";
import { PublicPage } from "./pages/public-page";

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
    <Switch>
      <Route path="/" exact component={HomePage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route path="/public" component={PublicPage} />
      <ProtectedRoute path="/protected" component={ProtectedPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <Route path="/callback" component={CallbackPage} />
      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
};

export default App;

// import React from 'react';
// import {Routes, Route} from "react-router-dom";

// import './App.css';
// import AuthProvider from './components/AuthProvider';
// import Layout from './components/Layout';
// import LoginPage from './components/LoginPage';
// import RequireAuth from './components/RequireAuth';
// import UserWatches from './components/UserWatches';

// function App() {
//   return (
//     <UserWatches />
//   );
// }

// function HomePage() {
//   return <h3>Welcome to the Home Page!</h3>;
// }

// function ProtectedPage() {
//   return <h3>Protected</h3>;
// }

// function App() {
//   return (
//     <AuthProvider>
//       <h1>Follow Line Dance Choreographers</h1>

//       <Routes>
//         <Route element={<Layout />}>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route
//             path="/protected"
//             element={
//               <RequireAuth>
//                 <UserWatches />
//               </RequireAuth>
//             }
//           />
//         </Route>
//       </Routes>
//     </AuthProvider>
//   );
// }

// export default App;
