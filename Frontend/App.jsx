import React from 'react'

import{
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from './pages/Dashboard/Expense';
import UserProvider from './context/UserContext';
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>

            {/* Root Route */}
            <Route path="/" element={<Root />} />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/income" 
              element={
                <ProtectedRoute>
                  <Income />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/expense" 
              element={
                <ProtectedRoute>
                  <Expense />
                </ProtectedRoute>
              } 
            />

          </Routes>
        </Router>
      </div>

      <Toaster 
        toastOptions={{
          className:"",
          style:{
            fontSize:"13px"
          },
        }}
      />
    </UserProvider>
  )
}

export default App;



//  Root Component
const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to="/login" />
  ) : (
    <Navigate to="/dashboard" />
  );
};


// ✅ Protected Route Component (NEW)
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};