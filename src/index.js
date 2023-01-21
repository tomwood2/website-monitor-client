
import React from "react";
import { createRoot} from 'react-dom/client';
import { /*BrowserRouter,*/ HashRouter } from "react-router-dom";
import App from "./App";
import { Auth0ProviderWithHistory } from "./auth0-provider-with-history";
import "./styles/styles.css";

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Auth0ProviderWithHistory>
         <App />
      </Auth0ProviderWithHistory>
    </HashRouter>
  </React.StrictMode>
);


// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
