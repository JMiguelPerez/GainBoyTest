import React from 'react';

import PageTitle from '../components/PageTitle';
import SignUp from '../components/SignUp';
import LoginNavBar from '../components/LoginNavBar';
import Footer from '../components/Footer';

const SignUpPage = () =>
{

    return (
      <div>
        <LoginNavBar />
        <h3>Fill Out Your Information</h3>
        <SignUp />
        <Footer />
      </div>
    );
};

export default SignUpPage;
