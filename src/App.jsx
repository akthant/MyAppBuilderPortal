import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Home from './pages/Home';
import ProjectGallery from './components/gallery/ProjectGallery';
import ProjectView from './components/gallery/ProjectView';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import './index.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          {/* Navigation Header */}
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link to="/" className="text-xl font-bold text-blue-600">
                  Mini AI App Builder Portal
                </Link>
                <div className="flex space-x-6">
                  <Link to="/" className="text-gray-600 hover:text-blue-600">
                    Create
                  </Link>
                  <Link to="/gallery" className="text-gray-600 hover:text-blue-600">
                    Gallery
                  </Link>
                  <Link to="/analytics" className="text-gray-600 hover:text-blue-600">
                    Analytics
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<ProjectGallery />} />
            <Route path="/projects/:identifier" element={<ProjectView />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;