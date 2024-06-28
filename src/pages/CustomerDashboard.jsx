import React, { useState } from 'react';
import axios from 'axios';
import RequestCredit from '../components/customer/RequestCredit';

const CustomerDashboard = () => {


    const performFunction = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/perform-function', {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Function performed');
        } catch (error) {
            console.error(error);
            alert('Error performing function');
        }
    };

    

    return (
        <div>
            <h2>Customer Dashboard</h2>
            <button onClick={performFunction}>Perform Function</button>
            <RequestCredit/>
        </div>
    );
};

export default CustomerDashboard;
