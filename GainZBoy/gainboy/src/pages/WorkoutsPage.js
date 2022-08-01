import React from 'react';

import Workouts from '../components/Workouts';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
const WorkoutsPage = () =>
{

    return (
      <div>
        <NavBar />
        <Workouts />
        <Footer />
      </div>
    );
};

export default WorkoutsPage;
