import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const {id} = useParams()
  console.log(id)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`);
        console.log(response)
        setUser(response.data);
      } catch (error) {
        console.error(error.response.data);
      }
    };

    fetchUser();
  }, [id]);

  return (
    <div>
        Hello World
      {user ? (
        <div>
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Credits: {user.credits}</p>
          <p>Sub-clients: {user.subClients.length}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserDetails;
