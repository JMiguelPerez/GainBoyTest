import React from "react";
import '../App.css';

function Home()
{
    return (
        <div class="homePage">
            <h2>Hello, [User's First Name]</h2>
            <div class="boxHome">
                <div class="BoxContainer">
                    <ul class="workoutOptions">
                        <li><div class="workoutOptions">EXAMPLE</div></li>
                        <li><div class="workoutOptions">EXAMPLE</div></li>
                        <li><div class="workoutOptions">EXAMPLE</div></li>
                        <li><div class="workoutOptions">EXAMPLE</div></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Home;