<template>
  <div class="followed-user-row">
    <div class="username">
      <a :href="`https://twitter.com/${user.username}`" target="_blank"> @{{ user.username }}</a>
      <span v-if="user.protected">🔒</span>
    </div>
    <div class="name">{{ user.name }}</div>
    <div class="metrics">{{ user.public_metrics.tweet_count }}</div>
    <div class="metrics">{{ user.public_metrics.following_count }}</div>
    <div class="metrics">{{ user.public_metrics.followers_count }}</div>
  </div>
</template>

<style lang="scss">
.followed-user-row {
  margin: 0.5rem;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: baseline;
}

.metrics {
  width: 100px;
  min-width: 100px;
}

.name,
.username {
  width: 200px;
  min-width: 200px;
  overflow-x: hidden;
  white-space: nowrap;
}

.username,
.name {
  padding: 0 0.5rem;
  margin: 0 0.5rem;
}
</style>

<script>
export default {
  props: {
    user: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>
