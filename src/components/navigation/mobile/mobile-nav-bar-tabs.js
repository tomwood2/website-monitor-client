import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { MobileNavBarTab } from "./mobile-nav-bar-tab";

export const MobileNavBarTabs = ({ handleClick }) => {

  const { isAuthenticated } = useAuth0();

  return (
    <div className="mobile-nav-bar__tabs">
      <MobileNavBarTab
        path="/profile"
        label="Profile"
        handleClick={handleClick}
      />
      <MobileNavBarTab
        path="/public"
        label="Public"
        handleClick={handleClick}
      />
      {isAuthenticated && (
        <>
          <MobileNavBarTab
            path="/my-watches"
            label="My Watches"
            handleClick={handleClick}
          />
          <MobileNavBarTab
            path="/admin"
            label="Admin"
            handleClick={handleClick}
          />
        </>
      )}
    </div>
  );
};
