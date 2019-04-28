import axios from 'axios';

export default function getUserRepo(token) {
    const config = {
        headers: { 'Authorization': `token ${token}` }
    };

    return new Promise(resolve => {
        axios.get(`https://api.github.com/user/repos?affiliation=collaborator`, config)
        .then(function (response) {
            resolve({ message: response.data });
        })
        .catch(function (error) {
            console.log(error);
        })
    })
};
