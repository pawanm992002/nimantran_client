import React, { useState } from 'react';
import axios from 'axios';

const CustomerDashboard = () => {
    const [credits, setCredits] = useState(0);

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

    const buyCredits = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/customer/buy-credits', { credits }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Credits purchased');
        } catch (error) {
            console.error(error);
            alert('Error buying credits');
        }
    };

    return (
        <div>
            <h2>Customer Dashboard</h2>
            <button onClick={performFunction}>Perform Function</button>
            <div>
                <h3>Buy Credits</h3>
                <input type="number" placeholder="Credits" value={credits} onChange={(e) => setCredits(e.target.value)} />
                <button onClick={buyCredits}>Buy Credits</button>
            </div>
        </div>
    );
};

export default CustomerDashboard;
