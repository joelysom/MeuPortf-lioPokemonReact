import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import StartPage from './pages/start';
import PikachuAime from './pages/paime';
import Box from './pages/box';
import BoxSummary from './pages/boxSummary';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pikachu-aime" element={<PikachuAime />} />
        <Route path="/box" element={<Box />} />
        <Route path="/box-summary" element={<BoxSummary />} />
      </Routes>
    </Router>
  );
}

export default App;
