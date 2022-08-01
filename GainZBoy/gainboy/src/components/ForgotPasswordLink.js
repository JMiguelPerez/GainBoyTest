import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    StyleSheet,
    Text,
    View, SafeAreaView,
    TouchableOpacity,
    TextInput,
} from 'react-native';

function ForgotPasswordLink(){
    
    const navigate = useNavigate();

    const goForgotPassword = async event => 
    {
    
        alert('forgetting');
        navigate('/forgotpassword');
    }
    return(
            <Text 
            style={styles.hyperlinkStyle}
            onPress={() => {
            goForgotPassword();
            }}>
            Forgot Password                                   
            </Text>
    );
}

const styles = StyleSheet.create({
    hyperlinkStyle: {
        color:'blue',
    }
})
export default ForgotPasswordLink;















