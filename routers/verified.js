import React from "react";
import { View, BrowserRouter, Route, Switch } from 'react-router-dom'
import Navbar from "../components/layouts/Navbar";

function verified() {
    //const { loggedIn } = useContext(AuthContext);
    return (
        <View><p>Verified</p></View>
    );
}

export default verified;