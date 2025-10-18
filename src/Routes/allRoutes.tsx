import React from "react";

import Dashboard from "../pages/Dashboard";
import Logout from "../pages/Authentication/Logout";
import Home from "../pages/Home";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/", component: <Home /> },
];

export { authProtectedRoutes, publicRoutes };