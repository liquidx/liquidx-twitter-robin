<template>
  <div class="home">
    <div class="followed">
      <div class="followed-user-header">
        <div class="followed-user-row">
          <div class="username">Username</div>
          <a href="#" class="name" @click.prevent="sortBy('name', 'asc')">Name</a>
          <a href="#" class="metrics" @click.prevent="sortBy('public_metrics.tweet_count')"
            >Tweets</a
          >
          <a href="#" class="metrics" @click.prevent="sortBy('public_metrics.following_count')"
            >Following</a
          >
          <a href="#" class="metrics" @click.prevent="sortBy('public_metrics.followers_count')"
            >Followers</a
          >
          <a href="#" class="metrics" @click.prevent="sortBy('latest_tweet.created_at')">Latest</a>
        </div>
      </div>
      <div v-for="user in following" :key="user.id" class="followed-user-table">
        <followed-user-row :user="user" @row-clicked="rowDidClick" />
      </div>
    </div>
    <div class="tweets"></div>
  </div>
</template>

<style lang="scss">
.home {
  font-size: 0.8rem;
}
.followed-user-header {
  font-weight: bold;

  a {
    text-decoration: none;
    color: inherit;
  }
}

.tweets {
  padding: 20px;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 300px;
  height: 100vh;
  overflow-y: scroll;
}

.twitter-tweet.loading {
  a {
    text-decoration: none;
    color: grey;
  }
}
</style>

<script>
/* eslint-disable vue/no-unused-components */
import FollowedUserRow from '../components/FollowedUserRow.vue';
import orderBy from 'lodash/orderBy';
import get from 'lodash/get';

export default {
  name: 'Home',
  components: {
    FollowedUserRow,
  },
  data() {
    return {
      following: [],
      latest: [],
      sortOrder: 'desc',
      sortKey: '',
    };
  },
  mounted() {
    const followingRequest = fetch('/data/following.json').then((response) => response.json());
    const latestRequest = fetch('/data/latest.json').then((response) => response.json());

    Promise.all([followingRequest, latestRequest]).then(([followingResponse, latestResponse]) => {
      this.latest = latestResponse;
      console.log(latestResponse);
      for (const follower of followingResponse) {
        if (this.latest[follower.id]) {
          follower.latest_tweet = this.latest[follower.id];
        }
      }
      this.following = followingResponse;
    });
  },
  methods: {
    sortBy(key, order) {
      order = order ? order : 'desc';
      if (this.sortKey == key) {
        order = order == 'desc' ? 'asc' : 'desc';
      }
      this.following = orderBy(this.following, [(v) => get(v, key)], [order]);
      this.sortKey = key;
      this.sortOrder = order;
      console.log(this.following);
    },
    loadTweetHack(tweet) {
      const tweetsDisplay = document.querySelector('.tweets');
      const tweetElement = document.createElement('div', 'tweet');

      const tweetHtml = `<blockquote class="twitter-tweet loading" data-url="https://twitter.com/twitter/status/${tweet.id}"><a href="https://twitter.com/twitter/status/${tweet.id}">${tweet.text}</a></blockquote>`;
      tweetElement.innerHTML = tweetHtml;
      tweetsDisplay.insertBefore(tweetElement, tweetsDisplay.firstChild);
      // eslint-disable-next-line no-undef
      twttr.widgets.load(tweetsDisplay);
    },
    loadTweet(tweet) {
      const oembed = `https://publish.twitter.com/oembed?url=https://twitter.com/user/status/${tweet.id}&omit_script=true`;
      fetch(oembed)
        .then((response) => response.json())
        .then((response) => {
          const tweetsDisplay = document.querySelector('.tweets');
          const tweetElement = document.createElement('div', 'tweet');
          tweetElement.innerHTML = response.html;
          tweetsDisplay.insertBefore(tweetElement, tweetsDisplay.firstChild);
        });
    },
    rowDidClick(userId) {
      const latestTweet = this.latest[userId];
      if (latestTweet) {
        this.loadTweetHack(latestTweet);
      }
    },
  },
};
</script>
