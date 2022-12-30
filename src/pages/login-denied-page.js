import React from "react";
import { PageLayout } from "../components/page-layout";

export const LoginDeniedPage = () => {
  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          {/* really want this message to come from error.message
          seen in useEffect() in App.js  */}
          You must verify your email before you can login.
        </h1>
      </div>
    </PageLayout>
  );
};
