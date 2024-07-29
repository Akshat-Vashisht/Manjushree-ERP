import { Toaster } from "react-hot-toast";
import ContainerMaster from "./pages/ContainerMaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Report1 from "./pages/Report-1";
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import useUserUtility from "./utils/useUserUtility";
import UsersIndex from "./pages/User/Index";
import SKUIndex from "./pages/SKU/Index";
import BusinessEntityIndex from "./pages/BusinessEntity/Index";
import CreateBusinessEntity from "./pages/BusinessEntity/Create";
import EditBusinessEntity from "./pages/BusinessEntity/Edit";
import Report2 from "./pages/Report-2";
import Report3 from "./pages/Report-3";
import Report4 from "./pages/Report-4";
import ContainerMovement from "./pages/ContainerMovement";
import SearchContainer from "./pages/SearchContainer";

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
        <Route 
          path="/1/sku-master" 
          element={
          <ProtectedRoute>
            <SKUIndex />
          </ProtectedRoute>
          } 
        />
        <Route 
          path="/1/business-entity-master" 
          element={
          <ProtectedRoute>
            <BusinessEntityIndex />
          </ProtectedRoute>
          } 
        />
        <Route 
          path="/1/business-entity-master/create"
          exact 
          element={
          <ProtectedRoute>
            <CreateBusinessEntity />
          </ProtectedRoute>
          } 
        />
        <Route 
          path="/1/business-entity-master/:entityId"
          exact 
          element={
          <ProtectedRoute>
            <EditBusinessEntity />
          </ProtectedRoute>
          } 

        <Route
          path="/1/reports/1"
          element={
            <ProtectedRoute>
              <Report1/>
            </ProtectedRoute>
          }
        />
         <Route
          path="/1/reports/2"
          element={
            <ProtectedRoute>
              <Report2/>
            </ProtectedRoute>
          }
        />
         <Route
          path="/1/reports/3"
          element={
            <ProtectedRoute>
              <Report3/>
            </ProtectedRoute>
          }
        />
         <Route
          path="/1/reports/4"
          element={
            <ProtectedRoute>
              <Report4/>
            </ProtectedRoute>
          }
        />
          <Route
          path="/1/container/movement"
          element={
            <ProtectedRoute>
              <ContainerMovement/>
            </ProtectedRoute>
          }
        />
         <Route
          path="/1/container/search"
          element={
            <ProtectedRoute>
              <SearchContainer/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
