import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import Form from './pages/Form';
import FormFill from './pages/FormFill';
import FormSuccess from './pages/FormSuccess';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/builder/:id" element={<FormBuilder />} />
                <Route path="/builder/new" element={<FormBuilder />} />
                <Route path="/form/:id" element={<Form />} />
                <Route path="/fill/:id" element={<FormFill />} />
                <Route path="/success" element={<FormSuccess />} />
            </Routes>
        </Router>
    );
}

export default App;
