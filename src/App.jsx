import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import UploadPage from './pages/UploadPage';
import SearchByPerson from './pages/SearchByPerson';
import SearchByEvent from './pages/SearchByEvent';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950">
        <Header />
        
        <main className="pt-24 pb-12 px-6">
          <div className="max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/upload" replace />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/search-by-person" element={<SearchByPerson />} />
              <Route path="/search-by-event" element={<SearchByEvent />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
