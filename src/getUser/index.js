import axios from 'axios';

export default function getUser(serviceToken, user) {
    return new Promise(resolve => {
        const username = user.sub
        const config = {
          headers: { 'Authorization': `Bearer ${serviceToken}` }
        };
        axios.get(`https://learn-byte.auth0.com/api/v2/users/${username}`, config)
        .then(function (response) {
          resolve({ message: response.data });
        })
        .catch(function (error) {
          console.log(error);
        })
    })
};
