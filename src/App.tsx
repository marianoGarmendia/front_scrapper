
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CarSearch from './components/CarSearch';
import AlertsPage from './pages/AlertsPage';
import AlertDetailPage from './pages/AlertDetailPage';
import ManagementPage from './pages/ManagementPage';
// import {CarsProvider} from './context/CarsContext.js';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<CarSearch />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/alerts/:id" element={<AlertDetailPage />} />
          <Route path="/management" element={<ManagementPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;