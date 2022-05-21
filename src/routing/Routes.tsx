import SuspenseComponent from "@components/common/suspense";
import React from "react";
import { Route, Routes } from "react-router-dom";

const Workspace = React.lazy(() => import("@src/pages/Workspace"));

export default function MainRouter(): React.ReactElement {
  return (
    <React.Suspense fallback={<SuspenseComponent />}>
      <Routes>
        <Route path='/' element={<Workspace />} />
      </Routes>
    </React.Suspense>
  );
}
