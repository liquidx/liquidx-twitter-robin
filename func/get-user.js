const fs = require('fs');
const path = require('path');
const { getTwitterClient } = require('./twitter-client');

const getUserId = async (client, username) => {
  const userResponse = await client.get('users/by', {
    usernames: username,
    'user.fields': ['public_metrics', 'name'],
  });
  return userResponse.data[0].id;
};

const getFollowing = async (client, username) => {
  const userId = await getUserId(client, username);
  const followingResponse = await client.get(`users/${userId}/following`, {
    max_results: 1000,
    'user.fields': ['public_metrics', 'name', 'description', 'protected'],
  });
  return followingResponse.data;
};

const getUserTimeline = async (client, userId, tweetCount) => {
  // https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets
  return await client.get(`users/${userId}/tweets`, {
    exclude: ['retweets', 'replies'],
    max_results: tweetCount,
    'tweet.fields': [
      'attachments',
      'created_at',
      'entities',
      'geo',
      'id',
      'public_metrics',
      'text',
      'source',
    ],
  });
};

const getFollowingTimelines = async (client, username, following, tweetCount, timelineFn) => {
  const userFetchLimit = 1000;
  const fetchingFollowing = following.slice(0, userFetchLimit);
  const followingTimelines = {};
  for (const followed of fetchingFollowing) {
    console.log(followed.id, followed.username);
    const followedTimeline = await getUserTimeline(client, followed.id, tweetCount);
    if (followedTimeline && followedTimeline.data) {
      if (timelineFn) {
        timelineFn(followed.id, followedTimeline.data);
      }
      followingTimelines[followed.id] = followedTimeline.data;
    }
  }
  return followingTimelines;
};

const createLastTweetIndex = async (following, getTimelineFn) => {
  const latestTweets = {};
  for (const followed of following) {
    let timeline = await getTimelineFn(followed.id);
    if (!timeline || timeline.length == 0) {
      continue;
    }

    if (timeline.data) {
      timeline = timeline.data;
    }
    if (timeline.length && timeline.length > 0) {
      const latestTweet = timeline[0];
      latestTweet.author = followed;
      latestTweets[followed.id] = timeline[0];
    }
  }
  return latestTweets;
};

const commandForGetFollowing = (program) => {
  program
    .command('get-following <username>')
    .option('--output <outputFile>', 'Write response to output file')
    .description('Get Following Accounts for User')
    .action(async (username, options) => {
      const twitterClient = getTwitterClient();
      const following = await getFollowing(twitterClient, username);
      if (options.output) {
        fs.writeFileSync(options.output, JSON.stringify(following));
      } else {
        console.log(following);
      }
    });
};

const commandForGetFollowingTimelines = (program) => {
  program
    .command('get-following-timelines <username>')
    .option('--following-list <followingJson>', 'Output of get-following.')
    .option('--tweet-count <tweetCount>', 'Number of tweets to fetch.', 10)
    .option('--output <outputDir>', 'Write timelines to a directory named with userId.json')
    .description('Get Following Accounts for User')
    .action(async (username, options) => {
      const twitterClient = getTwitterClient();
      let following = [];
      if (options.followingList) {
        following = JSON.parse(fs.readFileSync(options.followingList));
      } else {
        following = await getFollowing(twitterClient, username);
      }

      const outputTimeline = (followedId, timeline) => {
        if (!options.output) {
          return;
        }
        const outputPath = path.join(options.output, `${followedId}.timeline.json`);
        fs.writeFileSync(outputPath, JSON.stringify(timeline));
      };

      const followingTimelines = await getFollowingTimelines(
        twitterClient,
        username,
        following,
        options.tweetCount,
        outputTimeline
      );
      console.log(Object.keys(followingTimelines));
    });
};

const commandForGetUserTimeline = (program) => {
  program
    .command('get-user-timeline <username>')
    .option('--tweet-count <tweetCount>', 'Number of tweets to fetch.', 10)
    .option('--output <outputDir>', 'Write timelines to a directory named with userId.json')
    .description('Get user latest tweets')
    .action(async (username, options) => {
      const twitterClient = getTwitterClient();
      const userId = await getUserId(twitterClient, username);
      const timeline = await getUserTimeline(twitterClient, userId, options.tweetCount);

      if (options.output) {
        const outputPath = path.join(options.output, `${userId}.timeline.json`);
        fs.writeFileSync(outputPath, JSON.stringify(timeline));
      } else {
        console.log(timeline);
      }
    });
};

const commandForCreateLatestTweetIndex = (program) => {
  program
    .command('latest-tweets <username> <timelineDir>')
    .option('--following-list <followingJson>', 'Output of get-following.')
    .option('--output <outputFilename>', '')
    .description('Create latest tweet index for followers')
    .action(async (username, timelineDir, options) => {
      const twitterClient = getTwitterClient();
      let following = [];
      if (options.followingList) {
        following = JSON.parse(fs.readFileSync(options.followingList));
      } else {
        following = await getFollowing(twitterClient, username);
      }

      const getTimeline = (followedId) => {
        const timelinePath = path.join(timelineDir, `${followedId}.timeline.json`);
        return fs.promises
          .readFile(timelinePath)
          .then((response) => {
            return JSON.parse(response);
          })
          .catch(() => {
            return [];
          });
      };

      const latestTweets = await createLastTweetIndex(following, getTimeline);

      if (options.output) {
        fs.writeFileSync(options.output, JSON.stringify(latestTweets));
      } else {
        console.log(latestTweets);
      }
    });
};

module.exports = {
  commandForGetFollowing,
  commandForGetFollowingTimelines,
  commandForCreateLatestTweetIndex,
  commandForGetUserTimeline,
  getFollowingTimelines,
  getFollowing,
  getUserTimeline,
  getUserId,
};
