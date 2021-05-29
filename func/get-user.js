const fs = require('fs');
const Twitter = require('twitter-v2');
const Credentials = require('../credentials-twitter.json');

const twitterClient = new Twitter({
  bearer_token: Credentials.BEARER_TOKEN,
});

const getFollowing = async (client, username) => {
  const userResponse = await client.get('users/by', {
    usernames: username,
    'user.fields': ['public_metrics', 'name'],
  });
  console.log(userResponse.data);

  const userId = userResponse.data[0].id;
  const followingResponse = await client.get(`users/${userId}/following`, {
    max_results: 1000,
    'user.fields': ['public_metrics', 'name', 'description', 'protected'],
  });
  return followingResponse.data;
};

const getFollowingTimelines = async (client, username) => {
  const following = getFollowing(client, username);
};

const commandForGetFollowing = (program) => {
  program
    .command('get-following <userid>')
    .option('--output <outputFile>', 'Write response to output file')
    .description('Get Following Accounts for User')
    .action(async (userId, options) => {
      const following = await getFollowing(twitterClient, userId);
      if (options.output) {
        fs.writeFileSync(options.output, JSON.stringify(following));
      } else {
        console.log(following);
      }
    });
};

module.exports = {
  commandForGetFollowing,
  getFollowingTimelines,
  getFollowing,
};
