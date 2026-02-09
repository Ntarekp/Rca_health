import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Consultations from './pages/Consultations';
import NewConsultation from './pages/NewConsultation';
import ConsultationDetails from './pages/ConsultationDetails';
import Students from './pages/Students';
import StudentRegistration from './pages/StudentRegistration';
import StudentProfile from './pages/StudentProfile';
import LabAndHistory from './pages/LabAndHistory';
import NewLabRequest from './pages/NewLabRequest';
import LabResultDetails from './pages/LabResultDetails';
import Report from './pages/Report';
import Settings from './pages/Settings';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/consultations" element={<Consultations />} />
                  <Route path="/consultations/new" element={<NewConsultation />} />
                  <Route path="/consultations/:id" element={<ConsultationDetails />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/students/new" element={<StudentRegistration />} />
                  <Route path="/students/:id" element={<StudentProfile />} />
                  <Route path="/lab" element={<LabAndHistory />} />
                  <Route path="/lab/new" element={<NewLabRequest />} />
                  <Route path="/lab/:id" element={<LabResultDetails />} />
                  <Route path="/report" element={<Report />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
