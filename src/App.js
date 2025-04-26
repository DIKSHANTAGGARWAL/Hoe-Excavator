import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HoeExcavatorSelector from './HoeExcavatorSelector';
import HoeResultsPage from './HoeResultsPage';
import OptimiseHeight from './OptimiseHeight';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HoeExcavatorSelector />} />
        <Route path="/results" element={<HoeResultsPage />} />
        <Route path="/optimise-cost" element={<OptimiseHeight />} />
      </Routes>
    </Router>
  );
}

export default App;
