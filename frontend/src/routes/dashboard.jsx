// import { lazy, Suspense } from "react";
// import { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const user = JSON.parse(localStorage.getItem("campusflow_user") || "{}");
  return user.email ? element : <Navigate to="/" replace />;
};

import CampusFlowDashboard from "../components/CampusFlowDashboard";
import Login from "../components/Login";

const HomeRoute = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute element={<CampusFlowDashboard />} />,
  },
];

export default HomeRoute;
