import SuspenseComponent from "@components/common/suspense";
import Header from "@components/header";
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { home, cardPage } from "./screns";

const MainColumns = React.lazy(() => import("@src/pages/MainColumns"));
const CardPage = React.lazy(() => import("@src/pages/CardPage"));

export default function MainRouter(): React.ReactElement {
  return (
    <HashRouter basename={process.env.PUBLIC_URL}>
      <Header />
      <React.Suspense fallback={<SuspenseComponent />}>
        <Routes>
          <Route path={home} element={<MainColumns />} />
          <Route path={cardPage} caseSensitive element={<CardPage />} />
        </Routes>
      </React.Suspense>
    </HashRouter>
  );
}
