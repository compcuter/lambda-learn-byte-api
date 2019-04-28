import axios from 'axios';

export default function getAuth0ServiceToken() {
    return new Promise(resolve => {
        const postBody = {
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: "https://learn-byte.auth0.com/api/v2/",
            grant_type: "client_credentials"
        };

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        axios.post('https://learn-byte.auth0.com/oauth/token', postBody, config)
            .then(function (response) {
                resolve(response.data.access_token);
            })
            .catch(function (error) {
                console.log(error);
            })
    });
};