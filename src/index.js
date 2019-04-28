import serverless from 'serverless-http';
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import jwt_decode from 'jwt-decode';
import jwtAuthz from 'express-jwt-authz';
import jwksRsa from 'jwks-rsa';

import getAuth0ServiceToken from './getAuth0ServiceToken';
import getUser from './getUser';
import getTree from './getTree';
import getUserRepos from './getUserRepos';
import createRepo from './createRepo';
import deleteRepo from './deleteRepo';
import addCollaborator from './addCollaborator';
import course from './course';
import getUserInvitations from './getUserInvitations';

const app = express();

// jwksRsa from, https://github.com/auth0/node-jwks-rsa/blob/master/examples/express-demo/README.md

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
  
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
  });

const checkScopes = jwtAuthz(['read:messages']);

app.use(bodyParser.json({ strict: false }));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', 'https://www.learn-byte.com');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin");
    next();
});

app.get('/hello', function (req, res) {
    async function hello() {
        try {
            res.send("hello dude");
        } catch (e) {
            console.error(e);
        }
    }
    hello();
});
  
app.get('/user', checkJwt, checkScopes, function (req, res) {
    async function user() {
        try {
            const serviceToken = await getAuth0ServiceToken();
            const userToken = jwt_decode(req.headers.authorization.split(' ')[1])
            const user = await getUser(serviceToken, userToken);
            console.log('user', user)
            res.send(user);
        } catch (e) {
            console.error(e);
        }
    }
    user();
});

function wait(time) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), time);
    });
  }

app.post('/create-course', checkJwt, checkScopes, function (req, res) {
    async function createNewCourse() {
        try {
            const request = req.body
            const token = req.body.idToken
            const serviceToken = await getAuth0ServiceToken();
            const userToken = jwt_decode(req.headers.authorization.split(' ')[1])
            const user = await getUser(serviceToken, userToken);
            const userAccessToken = user.message.identities[0].access_token;
            const userRepos = await getUserRepos(userAccessToken);
            const userInvitations = await getUserInvitations(userAccessToken);
            let reposCount = 0;
            userInvitations.message.forEach(function(message) {
                if (message.inviter.login === "learn-byte") {
                    reposCount++;
                }
            })
            userRepos.message.forEach(function(message) {
                if (message.owner.login === "learn-byte") {
                    reposCount++;
                }
            })
            if (reposCount < 8 ){
                const newRepo = await createRepo(request);
                const repoName = newRepo.message.name;
                const idToken = jwt_decode(request.idToken)
                const username = idToken.nickname
                const newRepoCollaborator = await addCollaborator(username, repoName);
                const repoMake = await wait(1000);
                const templateCreated = await course(username, repoName);
                res.send(newRepoCollaborator);
            } else {
                res.status(400);
                res.send("Unable to create course: 8 course maximum per user");
            }
        } catch (e) {
            console.error(e);
        }
    }
    createNewCourse();
});

app.get('/course-tree', function (req, res) {
    async function courseTree() {
        try {
            const request = req.query.name
            const tree = await getTree(request);
            res.send(tree);
        } catch (e) {
            console.error(e);
        }
    }
    courseTree();
});

app.get('/user-repos', function (req, res) {
    async function userRepos() {
        try {
            const token = req.query.token
            const userRepos = await getUserRepos(token);
            res.send(userRepos);
        } catch (e) {
            console.error(e);
        }
    }
    userRepos();
});

app.get('/user-invitations', function (req, res) {
    async function userInvitations() {
        try {
            const token = req.query.token
            const userInvitations = await getUserInvitations(token);
            res.send(userInvitations);
        } catch (e) {
            console.error(e);
        }
    }
    userInvitations();
});

app.delete('/repo', checkJwt, checkScopes, function (req, res) {
    async function deleteRepository() {
        try {
            const repoName = req.body.repoName
            const userToken = req.body.userToken
            let userCanDeleteRepo = false;
            const userInvitations = await getUserInvitations(userToken);
            userInvitations.message.forEach(function(invitation) {
                if (invitation.permissions === "admin" && invitation.repository.name === repoName) {
                    userCanDeleteRepo = true;
                }
            }) 
            if (userCanDeleteRepo) {
                const deletedRepo = await deleteRepo(repoName);
                res.send().status(204);
            } else {
                res.send().status(403)
            }
        } catch (e) {
            console.error(e);
        }
    }
    deleteRepository();
});


module.exports.handler = serverless(app);