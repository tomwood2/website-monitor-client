import React from "react";
import { NavLink } from "react-router-dom";

export const NavBarBrand = () => {
  return (
    <div className="nav-bar__brand">
      <NavLink to="/">
        <header className="nav-bar__logo">Website Monitor</header>
        {/* <img
          className="nav-bar__logo"
          src="https://cdn.auth0.com/blog/hub/code-samples/hello-world/auth0-logo.svg"
          alt="Auth0 shield logo"
          width="122"
          height="36"
        /> */}
      </NavLink>
    </div>
  );
};
