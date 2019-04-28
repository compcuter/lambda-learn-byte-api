import axios from 'axios';

export default function deleteRepo(repo) {
    const config = {
        headers: { 'Authorization': `token ${process.env.GITHUB_SERVICE_TOKEN}` }
    };

    return new Promise(resolve => {
        console.log('about to call delete on repo config', config)
        axios.delete(`https://api.github.com/repos/learn-byte/${repo}`, config)
        .then(function (response) {
            console.log('repo delete response', response);
            resolve({ message: response.data });
        })
        .catch(function (error) {
            console.log('repo delete error', error)
            console.log(error);
        })
    })
};
