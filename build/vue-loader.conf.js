var utils = require('./utils')

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: true,
    extract: true
  })
}
