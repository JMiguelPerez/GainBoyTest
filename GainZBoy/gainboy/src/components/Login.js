import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    StyleSheet,
    Text,
    View, SafeAreaView,
    TouchableOpacity,
    TextInput,
} from 'react-native';





function Login()
{
    const navigate = useNavigate();

    const [txtError, setTextError] = useState('');

    const [email, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
 

    const navigateHome = () => 
    {
        navigate('/home');
    }

    const doLogin = async event => 
    {
        event.preventDefault();

        alert('Logging in!!');
        navigateHome();
    };

const signUp = () => 
{
    navigate('/signUp');

}
const handleApi = async () => {
    try{
    

    
        console.log(email, password);
        
        var item = { email : email.trim() , password : password.trim()};

        var js = JSON.stringify(item);

        const result = await fetch ("https://gainzboy.herokuapp.com/auth/login" , {
            method : 'POST',
            mode : 'cors',
            body : js ,
            headers : {
                "Content-Type" : "application/json" ,
                'Access-Control-Allow-Origin': '*',
            }     
        });
        var res = JSON.parse(await result.text());
        if (res.errorMessage != undefined) {
            setTextError(res.errorMessage);
        }
        else {
            global.userId = res.userID;
            global.token = res.token;
            global.fullName = res.fullname;
            global.email = email.trim();
            global.password = password.trim();

        }

    }catch(e){
        setTextError(e.message);
    }
}
const errorRender = () => {
    if (txtError != '')
        return (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.txtError}>{txtError}</Text>
        </View>);
    else
        return (<View />);
}
    return(
    <div class="box">
        <div id="loginDiv" class ="BoxContainer">
            <form class ="FormContainer">
            <span id="inner-title"> <h1>   GAINZ<span class="textLogo">BOY</span></h1></span><br />
            </form>
            <View style={{ height: '20%' }} />

                {/*Text Entries.*/}
                <View style={{ alignItems: 'center' }}>
                    <TextInput style={styles.txtSingleFactorInfo}
                        placeholder="email" placeholderTextColor={"#A482FF"}
                        onChangeText={(value) => setUsername(value)} />
                        <View style={styles.spaceContainer} />
                    <TextInput style={styles.txtSingleFactorInfo}
                    placeholder="password" placeholderTextColor={"#A482FF"} secureTextEntry={true}
                    onChangeText={(value) => setPassword(value)} />

                    <View style={{ height: 25 }} />
                        </View>
            
            <View style={{ height: 50 }} />
                <View style={{ paddingLeft: '70%', paddingTop: '5%' }}>
                    <View style={styles.indentContainer}>
                        {/*Sign Up Button.*/}
                        <TouchableOpacity style={styles.btn} onPress={() => navigate('/signUp')}>
                        <Text style={styles.txtSignUp}>Sign Up</Text>
                            </TouchableOpacity>
                                <View style={{ width: 70 }} />
                                {/*Login Button.*/}
                            <TouchableOpacity style={styles.btn} onPress={() => { handleApi(); }}>
                                    <Text style={styles.txtLogin}>Start</Text>
                            </TouchableOpacity>
                                </View>
                    </View>
            
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
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 18,
        color: "#8DF77D",
        transform: [{ rotate: "50deg" }],
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
export default Login;
