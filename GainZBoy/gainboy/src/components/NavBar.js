import React from 'react';

function NavBar()
{
    return(
        <div class="navBar"> 
            <span id="inner-title"><h1>GAINZ<span class="textLogo">BOY</span></h1></span>
            <ul>
                <li><a href="/home">Home</a></li>
                <li><a href="/">Sign Out</a></li>
            </ul>
        </div>  
      
    );
};

export default NavBar;
