var ghls = require('gh-ls');
 
export default function getTree(courseName) {
  const params = {
    token: `${process.env.GITHUB_SERVICE_TOKEN}`
  }
    return new Promise(resolve => {
      ghls(`learn-byte/${courseName}`, params, function (err, list) {
        resolve(list);
    })
  })
};
