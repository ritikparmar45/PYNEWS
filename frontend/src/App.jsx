import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Favorites from './pages/Favorites';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'sans-serif' }}>
        
        {/* Simple Navbar */}
        <nav className="bg-blue-800 text-white p-4 items-center flex justify-between">
          <Link to="/" className="text-xl font-bold hover:text-blue-200">
            📊 PYNEWS App
          </Link>
          <div className="flex gap-4">
            <Link to="/" className="hover:underline font-semibold">
              Home
            </Link>
            <Link to="/favorites" className="hover:underline font-semibold">
              Favorites
            </Link>
          </div>
        </nav>
        
        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
        
      </div>
    </Router>
  );
}

export default App;
