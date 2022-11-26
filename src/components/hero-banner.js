import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const HeroBanner = () => {
  // const logo = "https://cdn.auth0.com/blog/developer-hub/react-logo.svg";
  const { isAuthenticated } = useAuth0();

  return (
    <div className="hero-banner hero-banner--pink-yellow">
      {/* <div className="hero-banner__logo">
        <img className="hero-banner__image" src={logo} alt="React logo" />
      </div> */}
      <h1 className="hero-banner__headline">Welcome to Website Monitor!</h1>
      <p className="hero-banner__description">
        This application allows you to configure settings that enable you
        to monitor any website for changes.  When a change occurs, you change be notified.
      </p>
      {!isAuthenticated &&
      (<p className="hero-banner__description">Log in to get started.</p>)
      }
      {/* <a
        id="code-sample-link"
        target="_blank"
        rel="noopener noreferrer"
        href="https://auth0.com/developers/hub/code-samples/spa/react-javascript/basic-authentication"
        className="button button--secondary"
      >
        Check out the React code sample →
      </a> */}
    </div>
  );
};
