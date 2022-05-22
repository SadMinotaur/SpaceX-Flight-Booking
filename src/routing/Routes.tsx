import Header from "@components/header";
import SuspenseComponent from "@components/suspense";
import * as Screens from "@utils/screens";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Table = React.lazy(() => import("@src/pages/Table"));
const CardPage = React.lazy(() => import("@src/pages/CardPage"));

export default function MainRouter(): React.ReactElement {
  return (
    <BrowserRouter>
      <Header />
      <React.Suspense fallback={<SuspenseComponent />}>
        <Routes>
          <Route path={Screens.home} element={<Table />} />
          <Route path={Screens.cardPage} element={<CardPage />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
