import React from "react";
import { PageLayout } from "../components/page-layout";

export const LoginDeniedPage = () => {

  // sessionStorage was updated by useEffect in App.js
  const error = JSON.parse(sessionStorage.getItem('last-error'))

  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          {error.error}
        </h1> 
        <h2 id="page-title" className="content__title">
          {error.error_description}
        </h2>
      </div>
    </PageLayout>
  );
};
