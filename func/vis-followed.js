const fs = require('fs');
const path = require('path');

const D3Node = require('d3-node');
const groupBy = require('lodash/groupby');
const toPairs = require('lodash/toPairs');
const { DateTime } = require('luxon');

const { getFollowing } = require('./get-user');
const { getTwitterClient } = require('./twitter-client');

const visualizeFollowed = async (following, getTimelineFn) => {
  const svgs = {};

  const startDay = DateTime.fromJSDate(new Date(2018, 0, 1));
  const width = Math.ceil(-1 * startDay.diffNow('days').days);
  const height = 30;
  const dateFormat = 'yyyy-MM-dd';

  for (const followed of following) {
    let timeline = await getTimelineFn(followed.id)
      .then((response) => JSON.parse(response))
      .catch(() => {
        return [];
      });

    if (timeline.data) {
      timeline = timeline.data;
    }

    if (timeline.length && timeline.length > 0) {
      const d3n = new D3Node();
      const d3 = d3n.d3;
      const svg = d3n.createSVG().attr('viewBox', `0 0 ${width} ${height}`);

      const dates = timeline
        .map((t) => t.created_at)
        .map((d) => {
          return DateTime.fromISO(d).toFormat(dateFormat);
        });

      let dateCounts = toPairs(groupBy(dates));
      dateCounts = dateCounts.map((d) => {
        return {
          date: d[0],
          count: d[1].length,
          daysSince: -1 * Math.ceil(DateTime.fromFormat(d[0], dateFormat).diffNow('days').days),
        };
      });

      console.log(followed.id, dateCounts.length);

      dateCounts.forEach((d) => {
        const x = d.daysSince;
        const color = d3.color('black');
        color.opacity = Math.min(1, d.count / 3);
        svg
          .append('line')
          .attr('x1', x)
          .attr('x2', x)
          .attr('y1', 0)
          .attr('y2', height)
          .attr('stroke', color);
      });

      svgs[followed.id] = d3n.svgString();
    }
  }
  return svgs;
};

const commnadForVisualizeTimeline = (program) => {
  program
    .command('visualize-timeline <username> <timelineDir>')
    .option('--following-list <followingJson>', 'Output of get-following.')
    .option('--output <outputDir>', '')
    .description('Visualize Timeline')
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
        return fs.promises.readFile(timelinePath);
      };

      const svgs = await visualizeFollowed(following, getTimeline);

      if (options.output) {
        for (const followedId of Object.keys(svgs)) {
          const outputPath = path.join(options.output, `${followedId}.timeline.svg`);
          fs.writeFileSync(outputPath, svgs[followedId]);
        }
      } else {
        console.log(svgs);
      }
    });
};

module.exports = {
  commnadForVisualizeTimeline,
  visualizeFollowed,
};
