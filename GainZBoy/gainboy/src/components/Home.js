import React from "react";
import '../App.css';
import { useNavigate } from 'react-router-dom';
import Popup from "./Popup";
import { useState } from "react";

function Home()
{

    const [buttonPopup, setButtonPopup] = useState(false);
    
    const navigate = useNavigate();
    const navigateWorkouts = () => 
    {
        navigate('/workoutsPage');
    }
       
    return (
        <div class="homePage">
            <h2>Hello, {global.fullName}</h2>
            <div class="boxHome">
                <div class="BoxContainer">
                    <ul class="homePageOptions">
                        <li><button class="homePageOption" onClick={navigateWorkouts}>View Workouts</button></li>
                        <li><button class="homePageOption" onClick={ () => setButtonPopup(true) }>Add Workouts</button></li>
                    </ul>
                    <Popup trigger={buttonPopup} >
                    <ul class="addWorkoutList">
                        <li><input type="text" id="workoutName" placeholder="Workout Name" required/><br /></li>
                        <li><input type="text" id="workoutWeight" placeholder="Workout Weight" required/><br /></li>
                        <li><input type="text" id="workoutReps" placeholder="Number of Reps" required/><br /></li>
                        <li><input type="text" id="workoutSets" placeholder="Number of Sets" required/><br /></li>
                    </ul>
                    <button className="closeBtn" onClick={ () => setButtonPopup(false) }>close</button>
                    <button className="saveBtn" onClick={ () => setButtonPopup(false) }>Add</button>
                    </Popup>
                </div>
            </div>
        </div>
        
    );
}

export default Home;