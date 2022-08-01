import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    StyleSheet,
    Text,
    View, SafeAreaView,
    TouchableOpacity,
    TextInput,
} from 'react-native';

function ForgotPasswordScreen(){
    
    const [email, setEmail] = useState("");
    
    const [txtError, setTextError] = useState('');

    const handleApi = async() =>{

        console.log(email);
        
        try{

        var item = { email : email.trim()};

        var js = JSON.stringify(item);

        const result = await fetch ("https://gainzboy.herokuapp.com/auth/sendPasswordReset" , {
            method : 'POST',
            mode : 'no-cors',
            body : js ,
            headers : {
                "Content-Type" : "application/json" ,
            }     
        });
        var res = JSON.parse(await result.text());
        if (res.errorMessage != undefined) {
            setTextError(res.errorMessage);
        }

    }catch(e){
        setTextError(e.message);
    }
}
    

    return(
        
       <div class="boxForgot">
        <span id="inner-title"><h1>GAINZ<span class="textLogo">BOY</span></h1></span>
            <div id="loginDiv" class ="BoxContainer">
                
                <TextInput style={styles.txtSingleFactorInfo}
                    placeholder="email" placeholderTextColor={"#A482FF"}
                    onChangeText={(value) => setEmail(value)}
                    required={true}/>
                <TouchableOpacity style={styles.btn} onPress={() => handleApi()}>
                <Text style={styles.txtSignUp}>New User</Text>
                </TouchableOpacity>
                
            </div>
        </div>
                    
    );


};
const styles = StyleSheet.create({
    spaceContainer: {
        height: 50
    },
    indentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        height: 90,
        width: 220,
        backgroundColor: "#595757",
        borderRadius: 100,
        transform: [{ rotate: "-50deg" }],
    },
    txtSingleFactorInfo: {
        height: 65,
        width: 300,
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 8,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 50,
        fontSize: 25,
        backgroundColor: "#EDEDDD",
        color: "#3C3A3A",
        shadowColor: 'black',
        shadowRadius: 3,
        shadowOffset: { width: 3, height: 10, },
        shadowOpacity: 0.5,
    },
    btn: {
        position:'relative',
        height: 60,
        width: 60,
        bottom: -60,
        right: -130,
        marginBottom: 10,
        borderRadius: 100,
        backgroundColor: '#A482FF',
        shadowColor: 'black',
        shadowRadius: 3,
        shadowOffset: { width: 3, height: 5, },
        shadowOpacity: 0.5,
    },
    txtForgotPassword: {
        fontSize: 20,
        color: "#8DF77D"
    },
    txtLogin: {
        fontSize: 25,
        color: "#8DF77D",
        transform: [{ rotate: "50deg" }],
    },
    txtSignUp: {
        position:"absolute",
        bottom: 10,
        fontSize: 18,
        color: "#8DF77D",
    },
    txtError: {
        fontSize: 20,
        color: '#E2202C'
    },
    textStyle: {
        margin: 10,
        alignSelf:'center',
        textAlign:'center'
    },
    titlestyle: {
        fontSize: 20,
        margin:10,
        textAlign:'center'
    },
    hyperlinkStyle: {
        color:'blue',
    }
});
export default ForgotPasswordScreen;