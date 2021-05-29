<template>
  <div class="home">
    <div class="followed">
      <div class="followed-user-header">
        <div class="followed-user-row">
          <div class="username">handle</div>
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
        </div>
      </div>
      <div v-for="user in following" :key="user.id" class="followed-user-table">
        <followed-user-row :user="user" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.followed-user-header {
  font-weight: bold;

  a {
    text-decoration: none;
    color: inherit;
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
      sortOrder: 'desc',
      sortKey: '',
    };
  },
  mounted() {
    fetch('/data/following.json')
      .then((response) => response.json())
      .then((response) => {
        this.following = response;
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
  },
};
</script>
