<template>
  <div class="followed-user-row">
    <div class="latest-at">
      <a v-if="user.latest_tweet" href="#" @mouseenter.prevent="$emit('row-clicked', user.id)">{{
        relativeTweetTime
      }}</a>
    </div>
    <div class="username">
      <a :href="`https://twitter.com/${user.username}`" target="_blank"> @{{ user.username }}</a>
      <span v-if="user.protected">🔒</span>
    </div>
    <div class="name">{{ user.name }}</div>
    <div class="metrics">{{ user.public_metrics.tweet_count }}</div>
    <div class="metrics">{{ user.public_metrics.following_count }}</div>
    <div class="metrics">{{ user.public_metrics.followers_count }}</div>
    <div class="spark"><img v-if="user.latest_tweet" :src="sparklineSvg" height="15" /></div>
  </div>
</template>

<style lang="scss">
.followed-user-row {
  margin: 0.3rem;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: baseline;
}

.metrics {
  width: 80px;
  min-width: 80px;
}

.name,
.username,
.latest-at {
  width: 150px;
  min-width: 150px;
  overflow-x: hidden;
  white-space: nowrap;
}

.username,
.name .latest-at {
  padding: 0 0.3rem;
  margin: 0 0.3rem;
}

.latest-at {
  a {
    text-decoration: none;
    color: inherit;
  }
}

.spark {
  img {
    height: 15px;
  }
}
</style>

<script>
import { DateTime } from 'luxon';
export default {
  props: {
    user: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    relativeTweetTime() {
      if (!this.user || !this.user.latest_tweet) {
        return 'None';
      }
      const today = DateTime.now();
      const date = DateTime.fromISO(this.user.latest_tweet.created_at);
      if (date.year != today.year) {
        return date.toFormat('yyyy MM dd');
      } else {
        return date.toRelative({ base: today });
      }
    },
    sparklineSvg() {
      return `/timelines/${this.user.id}.timeline.svg`;
    },
  },
};
</script>
