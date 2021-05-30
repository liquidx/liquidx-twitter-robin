const Twitter = require('twitter-v2');
const Credentials = require('../credentials-twitter.json');

const getTwitterClient = () => {
  return new Twitter({
    bearer_token: Credentials.BEARER_TOKEN,
  });
};

module.exports = {
  getTwitterClient,
};
