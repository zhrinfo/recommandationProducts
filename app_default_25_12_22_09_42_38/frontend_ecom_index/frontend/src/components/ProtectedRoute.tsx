import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedGender: "MALE" | "FEMALE";
}

const ProtectedRoute = ({ children, allowedGender }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const gender = localStorage.getItem("gender");

  if (!token) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (gender !== allowedGender) {
    // User doesn't have the right gender for this route
    // Redirect to their correct section
    if (gender === "MALE") {
      return <Navigate to="/homme" replace />;
    } else if (gender === "FEMALE") {
      return <Navigate to="/femme" replace />;
    }
    // Fallback to home if gender is unknown
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
