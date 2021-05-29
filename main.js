const process = require('process');
const commander = require('commander');
const { commandForGetFollowing } = require('./func/get-user.js');

const main = () => {
  const program = new commander.Command();
  program.version('1.0');
  commandForGetFollowing(program);

  program.parse(process.argv);
};

main();
