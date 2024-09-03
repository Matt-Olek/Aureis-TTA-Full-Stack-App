// src/App.jsx
import { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import { AuthLayout } from './routeLayouts/AuthLayout';
import { AdminStaffAuthLayout } from './routeLayouts/AdminStaffAuthLayout';

import Login from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
import Search from './pages/Search';
import SearchApplicant from './components/SearchApplicant';
import ApplicantManagement from './components/ApplicantManagement';
import CompanyManagement from './components/CompanyManagement';
import MatchManagement from './components/MatchManagement';
import FlyingMessage from './components/FlyingMessage';
import OfferManagement from './components/OfferManagement';
import FormationManagement from './components/FormationManagement';
import CreateUser from './components/CreateUser';
import ApplicantPage from './components/ApplicantPage';

// Create context for the flying message
const FlyingMessageContext = createContext();

export const useFlyingMessage = () => useContext(FlyingMessageContext);

function App() {
  const queryClient = new QueryClient();
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const showMessage = (msg, duration = 3000) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, duration);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FlyingMessageContext.Provider value={showMessage}>
          <Router>
            <Navbar />
            <FlyingMessage message={message} visible={visible} duration={3000} />
            <Routes>
              {/* Define routes that don't need layout */}
              <Route path="/login" element={<Login />} />
              <Route path="/register-applicant/:token" element={<CreateUser />} />
              <Route path="/applicant/application" element={<ApplicantPage />} />

              {/* Define routes that use AuthLayout */}
              <Route path="/" element={<AuthLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminStaffAuthLayout />}>
                  <Route path="applicant-management" element={<ApplicantManagement />} />
                  <Route path="company-management" element={<CompanyManagement />} />
                  <Route path="match-management" element={<MatchManagement />} />
                  <Route path="search" element={<Search />} />
                  <Route path="search/applicant" element={<SearchApplicant />} />
                  <Route path="offer-management" element={<OfferManagement />} />
                  <Route path="formation-management" element={<FormationManagement />} />
                </Route>
              </Route>

              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </FlyingMessageContext.Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
