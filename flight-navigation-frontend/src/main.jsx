import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
      <ToastContainer/>
    </React.StrictMode>
  </BrowserRouter>
);
