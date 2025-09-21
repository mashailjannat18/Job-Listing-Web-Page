import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css"
import Home from './Pages/Home';
import AddJob from './Pages/AddJob';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addjob" element={<AddJob />} />
      </Routes>
    </Router>
  );
}