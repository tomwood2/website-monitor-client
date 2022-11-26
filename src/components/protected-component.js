import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { PageLoader } from "./page-loader";

export const ProtectedComponent = ({ component, ...args}) => {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => (
          <div className="page-layout">
            <PageLoader />
          </div>
        ),});
    return <Component {...args} />
  }