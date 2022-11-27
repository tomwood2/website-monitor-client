import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Route, Routes } from "react-router-dom";
import { PageLoader } from "./components/page-loader";
import { ProtectedComponent } from './components/protected-component';
import { AdminPage } from "./pages/admin-page";
import { CallbackPage } from "./pages/callback-page";
import { HomePage } from "./pages/home-page";
import { NotFoundPage } from "./pages/not-found-page";
import { ProfilePage } from "./pages/profile-page";
import { ProtectedPage } from "./pages/protected-page";
import { PublicPage } from "./pages/public-page";
import UserWatches from './components/UserWatches';

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
      <Route path="/profile" element={<ProtectedComponent component={ProfilePage} />} />
      <Route path="/public" element={<PublicPage />} />
      {/* <Route path="/protected" element={<ProtectedComponent component={ProtectedPage} testProp={'test prop value'}/>} /> */}
      <Route path="/protected" element={<ProtectedComponent component={UserWatches} testProp={'test prop value'}/>} />
      <Route path="/admin" element={<ProtectedComponent component={AdminPage} />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
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
