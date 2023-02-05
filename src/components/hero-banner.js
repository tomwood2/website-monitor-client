import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const HeroBanner = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="hero-banner hero-banner--aqua-emerald">
      <h1 className="hero-banner__headline">Welcome to Step Sheet Watch!</h1>
      <p className="hero-banner__description">
        This application allows you to configure settings that enable you
        to monitor <a href='https://copperknob.co.uk' target='_blank' rel='noreferrer'>copperknob.co.uk</a> for new line dance step sheets for specifed choreographers.  When a change occurs, you can be notified by
        email or a push notification.
      </p>
      {!isAuthenticated &&
      (<p className="hero-banner__description">Log in to get started.</p>)
      }
    </div>
  );
};
