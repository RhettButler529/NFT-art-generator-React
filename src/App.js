// import './App.css';
import "./styles/global.scss";
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/home';
import About from './pages/about';
import Generator from './pages/generator';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path = "/" element = {<Navigate to = "/home"/>} />
        <Route path = "/home" element = {<Home />} />
        <Route path = "/about" element = {<About />} />
        <Route path = "/generator" element = {<Generator />} />
      </Routes>
    </div>
  );
}

export default App;
