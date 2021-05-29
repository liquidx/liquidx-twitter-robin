const process = require('process');
const commander = require('commander');
const {
  commandForGetFollowing,
  commandForGetFollowingTimelines,
  commandForCreateLatestTweetIndex,
} = require('./func/get-user.js');

const main = () => {
  const program = new commander.Command();
  program.version('1.0');
  commandForGetFollowing(program);
  commandForGetFollowingTimelines(program);
  commandForCreateLatestTweetIndex(program);
  program.parse(process.argv);
};

main();
