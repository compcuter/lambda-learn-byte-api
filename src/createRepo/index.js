import axios from 'axios';

export default function createRepo(request) {
    const postBody = {
        name: request.name
    };
    const config = {
        headers: { 'Authorization': `token ${process.env.GITHUB_SERVICE_TOKEN}` }
    };
    return new Promise(resolve => {
        axios.post(`https://api.github.com/user/repos`, postBody, config)
        .then(function (response) {
            resolve({ message: response.data });
        })
        .catch(function (error) {
            console.log(error);
        })
    })
};
