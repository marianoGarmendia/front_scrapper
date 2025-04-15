
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CarSearch from './components/CarSearch';
import AlertsPage from './pages/AlertsPage';
import AlertDetailPage from './pages/AlertDetailPage';
import MyVehiclesPage from './pages/MyVehiclesPage';
import VehicleListPage from './pages/VehicleListPage';
import {Toaster} from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
// import ManagementPage from './pages/ManagementPage';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Toaster />
        
        <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
            path="/"
            element={
              <ProtectedRoute>
                <CarSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <AlertsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts/:id"
            element={
              <ProtectedRoute>
                <AlertDetailPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute>
                <MyVehiclesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles/:id/:brand"
            element={
              <ProtectedRoute>
                <VehicleListPage />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/management" element={<ManagementPage />} /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;