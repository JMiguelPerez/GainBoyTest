import './App.css';
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import WorkoutsPage from './pages/WorkoutsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

global.userId           = "";
global.token            = "";
global.email            = "";        // need to cache this for verification
global.password         = "";        // need to cache this for verification
global.fullName         = "";
global.exercises        = [];        // caches ALL the exercises of the user
global.exerciseMap      = new Map(); // Key: workout name, Value: workout id
global.exerciseBegin    = [];        // the list of exercises for BeginWorkout list
global.exerciseHistory  = [];        // the list of exercises used in the last workout
global.logTime          = ""; 

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path ='/' element={<LoginPage />} />
          <Route path ='/home' element={<HomePage />} />
          <Route path ='/workoutsPage' element={<WorkoutsPage />} />
          <Route path ='/forgotpassword' element={<ForgotPasswordPage />} />
          <Route path ='/signUp' element={<SignUpPage />} />
          <Route path ='*' element={<div>Component not found at this class level</div>} />

        </Routes>  
      </Router>
    </div>
  );
}

export default App;
