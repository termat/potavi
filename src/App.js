import './App.css';
import { BrowserRouter, Routes ,Route} from 'react-router-dom';
import Dashboard from './components/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/potavi" element={<Dashboard />} />
        <Route path="/potavi/:page" element={<Dashboard />} />
        <Route path="*" element={<div>404 page not found.</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
