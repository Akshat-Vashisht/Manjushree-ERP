import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedin = useSelector((state) => state.user.isLoggedin);
  const isSessionLoaded = useSelector((state) => state.user.isSessionLoaded);

 

  if (isSessionLoaded) {
    if (!isLoggedin) {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  // TODO:
  // if (!isLoggedin) {
  //   return <Navigate to="/" replace />;
  // } 
  // if (isSessionLoaded) {
  //   if (isLoggedin && !hasAccess(requiredRoles)) {
  //     return <Navigate to="/unauthorized" replace />;
  //   }
  //   return children;
  // }
};

export default ProtectedRoute;
