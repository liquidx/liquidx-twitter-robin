module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'src/index.html',
      filename: 'index.html',
      title: '🐤  Robin',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
  devServer: {
    port: 8200,
  },
};
