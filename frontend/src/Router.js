import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Navbar from "./components/layouts/Navbar";

function Router() {
    //const { loggedIn } = useContext(AuthContext);
    return (
      <BrowserRouter>
       <Navbar />
        <Switch>
            <Route exact path="/">
                <div>Home</div>
            </Route>
            <Route path="/register">
                <div>Register</div>
            </Route>
            <Route path="/login">
                <div>Login</div>
            </Route>
            <Route path="/customer">
                <div>Customer </div>
            </Route>
        </Switch>
      </BrowserRouter>
    );
  }
  
  export default Router;