import logo from './logo.svg';
import './App.css';
import Login from './components/Login'
import Signup from './components/Signup'
import Presurvey from './Presurvey'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (

    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/presurvey" element={<Presurvey />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;