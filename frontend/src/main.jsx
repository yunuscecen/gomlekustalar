import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { SiteProvider } from "./context/SiteContext";

import "./index.css";
import "./styles/site.css";
import "./styles/admin.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SiteProvider>
        <AdminAuthProvider>
          <App />
        </AdminAuthProvider>
      </SiteProvider>
    </BrowserRouter>
  </StrictMode>
);