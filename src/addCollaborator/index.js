import axios from 'axios';

export default function addCollaborator(username, repoName) {
    const postBody = {
        permission: "admin"
    };
    const config = {
        headers: { 'Authorization': `token ${process.env.GITHUB_SERVICE_TOKEN}` }
    };
    return new Promise(resolve => {
        axios.put(`https://api.github.com/repos/learn-byte/${repoName}/collaborators/${username}`, postBody, config)
        .then(function (response) {
            resolve({ message: response.data });
        })
        .catch(function (error) {
            console.log(error);
        })
    })
};
