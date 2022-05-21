import SuspenseComponent from "@components/common/suspense";
import Header from "@components/header";
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { cardPage, home } from "./screens";

const Table = React.lazy(() => import("@src/pages/Table"));
const CardPage = React.lazy(() => import("@src/pages/CardPage"));

export default function MainRouter(): React.ReactElement {
  return (
    <HashRouter basename={process.env.PUBLIC_URL}>
      <Header />
      <React.Suspense fallback={<SuspenseComponent />}>
        <Routes>
          <Route element={<Table />} path={home} />
          <Route element={<CardPage />} path={cardPage} caseSensitive />
        </Routes>
      </React.Suspense>
    </HashRouter>
  );
}
