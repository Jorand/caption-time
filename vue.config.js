const path = require('path')

module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, './src/styles/global.scss')]
    },
    electronBuilder: {
      // removeElectronJunk: false,
      builderOptions: {
        'fileAssociations': {
          'ext': ['mkv', 'avi', 'mp4'],
          'name': 'Movies'
        }
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // mutate config for production...
    } else {
      // mutate for development...
    }
  }
}
