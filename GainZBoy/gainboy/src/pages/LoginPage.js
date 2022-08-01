import React from 'react';

import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import LoginNavBar from '../components/LoginNavBar';
import Footer from '../components/Footer';
import ForgotPasswordLink from '../components/ForgotPasswordLink';

const LoginPage = () =>
{

    return (
      <div>
        <LoginNavBar />
        <PageTitle />
        <Login />
        <ForgotPasswordLink/>
        <Footer />

      </div>
    );
};

export default LoginPage;
