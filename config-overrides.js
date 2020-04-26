const { override, addPostcssPlugins } = require('customize-cra')
module.exports = override(
  addPostcssPlugins(
  	[
  	  	require('postcss-inline-svg')

  	])
)
