import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/app";
import "./src/styles/global.scss";

const el = document.getElementById("root");
if (el === null) throw new Error("Root container missing in index.html");

const root = ReactDOM.createRoot(el);
root.render(<App />);
