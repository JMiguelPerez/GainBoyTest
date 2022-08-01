import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';

function SignUp()
{
    const navigate = useNavigate();
    const [txtError, setTextError] = useState('');

    const [name, setName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");

    const doSignUp = async event => 
    {
        event.preventDefault();

        alert('SIGNING UP BUTTON CLICKED!');
    };
const handleApi = async() =>
{
    try{
    

    
        
        var item = { email : name.trim() , fullName : userEmail.trim(), password : loginPassword.trim(), passwordVerify : verifyPassword.trim()};

        var js = JSON.stringify(item);

        const result = await fetch ("https://gainzboy.herokuapp.com/auth/Register" , {
            method : 'POST',
            mode : 'cors',
            body : js ,
            headers : {
                "Content-Type" : "application/json" ,
            }     
        });
        var res = JSON.parse(await result.text());
        if (res.errorMessage != undefined) {
            setTextError(res.errorMessage);
        }
        else {
           alert("success");
          

        }

    }catch(e){
        setTextError(e.message);
    }
}
    return(
      <div class="box">
        <div id="loginDiv" class ="BoxContainer">
            <form class ="FormContainer" onSubmit={doSignUp}>
            <span id="inner-title"><h1>GAINZ<span class="textLogo">BOY</span></h1></span><br />
            <input type="text" id="name" placeholder="John" 
            onChange={(e)=>setName(e.target.value)}
            required/><br />
            <input type="email" id="userEmail" placeholder="123@example.com" 
            onChange={(e)=>setUserEmail(e.target.value)}
            required/><br />
            <input type="password" id="loginPassword" placeholder="Password" 
            onChange={(e)=>setLoginPassword(e.target.value)}
            required/><br />
            <input type="password verify" id="verifyPassword" placeholder="Verify Password"
            onChange={(e)=>setVerifyPassword(e.target.value)}
            required/><br />
            <button onClick={handleApi} className="loginButton"> Sign Up</button>
            </form>
            <a href="/" class="NewAccount">Already have an account?</a>
            <span id="loginResult"></span>
        </div>
        </div>  
      
    );
};

export default SignUp;
