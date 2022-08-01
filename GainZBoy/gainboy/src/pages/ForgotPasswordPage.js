import React from 'react';


import LoginNavBar from '../components/LoginNavBar';
import Footer from '../components/Footer';
import ForgotPasswordScreen from '../components/ForgotPasswordScreen';
import PageTitle from '../components/PageTitle';

const ForgotPasswordPage = () =>
{

    return (
      <div>
        <LoginNavBar />
        <PageTitle />
        <ForgotPasswordScreen />
        <Footer />
      </div>
    );
};

export default ForgotPasswordPage;