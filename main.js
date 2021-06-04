const process = require('process');
const commander = require('commander');
const {
  commandForGetFollowing,
  commandForGetFollowingTimelines,
  commandForCreateLatestTweetIndex,
  commandForGetUserTimeline,
} = require('./func/get-user.js');

const { commnadForVisualizeTimeline } = require('./func/vis-followed');

const main = () => {
  const program = new commander.Command();
  program.version('1.0');
  commandForGetFollowing(program);
  commandForGetFollowingTimelines(program);
  commandForCreateLatestTweetIndex(program);
  commnadForVisualizeTimeline(program);
  commandForGetUserTimeline(program);
  program.parse(process.argv);
};

main();
