import { Toaster } from "react-hot-toast";
import ContainerMaster from "./pages/ContainerMaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import useUserUtility from "./utils/useUserUtility";
import UsersIndex from "./pages/User/Index";

function App() {
  useUserUtility();
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route
          path="/1/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/1/container-master"
          element={
            <ProtectedRoute>
              <ContainerMaster />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/1/user-master" 
          element={
          <ProtectedRoute>
            <UsersIndex />
          </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
