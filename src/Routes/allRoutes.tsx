import React from "react";

import Dashboard from "../pages/Dashboard";
import Logout from "../pages/Authentication/Logout";
import Home from "../pages/Home";
import Battle from "../pages/Battle";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/battles", component: <Battle /> },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/", component: <Home /> },
];

export { authProtectedRoutes, publicRoutes };