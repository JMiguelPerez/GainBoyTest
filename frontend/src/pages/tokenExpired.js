import React from "react";
import { View, BrowserRouter, Route, Switch } from 'react-router-dom'


function verified() {
    //const { loggedIn } = useContext(AuthContext);
    return (
        <View><p>Token Expired, please register again</p></View>
    );
}

export default verified;