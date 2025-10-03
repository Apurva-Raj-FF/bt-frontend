/**
 * Main Application Component Module
 * Serves as the root component of the application
 * Handles routing and authentication context
 * Integrates Google OAuth for authentication
 */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from './context/AuthContext';
import StrategyDetails from './components/SharedStrategy';
import GoogleAuthCallback from './components/GoogleAuthCallback';

// MUI Imports
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./styles/theme"; // your custom MUI theme

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes styles and applies font */}
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/strategy/shared/:strategyId" element={<StrategyDetails />} />
              <Route path="/google/callback" element={<GoogleAuthCallback />} />
              <Route path="*" element={<AppRoutes />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
};

export default App;

