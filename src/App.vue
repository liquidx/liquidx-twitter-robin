<template>
  <div id="app">
    <h1>🐤 Robin</h1>
    <router-view />
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}

#app {
  font-family: Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  padding: 1rem;
}

h1,
h2,
h3 {
  font-size: 1rem;
}
</style>
