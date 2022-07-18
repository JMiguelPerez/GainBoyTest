import React, { useContext } from "react";
import { Link } from "react-router-dom";
//import AuthContext from "../../context/AuthContext";
//import LogOutBtn from "../auth/LogOutBtn";

function Navbar() {
  //const { loggedIn } = useContext(AuthContext);

  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      <Link to="/login">Log in</Link>
      <Link to="/customer">Customers</Link>

    </div>
  );
}

export default Navbar;