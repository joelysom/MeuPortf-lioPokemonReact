import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import StartPage from './pages/start';
import PikachuAime from './pages/paime';
import Box from './pages/box';
import BoxSummary from './pages/boxSummary';
import Pokedex from './pages/dex';
import ProfessorTutorial from './pages/professorTutorial';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/professor-tutorial" element={<ProfessorTutorial />} />
        <Route path="/pikachu-aime" element={<PikachuAime />} />
        <Route path="/box" element={<Box />} />
        <Route path="/box-summary" element={<BoxSummary />} />
        <Route path="/pokedex" element={<Pokedex />} />
      </Routes>
    </Router>
  );
}

export default App;
