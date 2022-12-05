
import React from "react";
import { createRoot} from 'react-dom/client';
// import ReactDOM from "react-dom";
import { /*BrowserRouter,*/ HashRouter } from "react-router-dom";
import App from "./App";
import { Auth0ProviderWithHistory } from "./auth0-provider-with-history";

import "./styles/styles.css";


const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
    <HashRouter>
      <Auth0ProviderWithHistory>
        <App />
      </Auth0ProviderWithHistory>
    </HashRouter>
    {/* </BrowserRouter> */}
  </React.StrictMode>
);

// ReactDOM.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>,
//   document.getElementById("root")
// );

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { BrowserRouter } from 'react-router-dom';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   // strict mode renders everything twice in dev mode
//   // <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   // </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
