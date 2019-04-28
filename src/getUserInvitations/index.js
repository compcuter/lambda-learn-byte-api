import axios from 'axios';

export default function getUserInvitations(token) {
    const config = {
        headers: { 'Authorization': `token ${token}` }
    };
    return new Promise(resolve => {
        axios.get(`https://api.github.com/user/repository_invitations`, config)
        .then(function (response) {
            const invitationsForUser = response.data;
            const invitations = [];
            invitationsForUser.forEach(function(invitation) {
                if (invitation.inviter.login === "learn-byte") {
                    invitations.push(invitation);
                }
            })
            resolve({ message: invitations });
        })
        .catch(function (error) {
            console.log(error);
        })
    })
};
