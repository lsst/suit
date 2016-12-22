/* eslint-env node */

require('babel-core/register')({presets: ['es2015']});
var path = require('path');

var firefly_root = path.resolve(__dirname, '../../../firefly');
var name = 'suit';
var entry = {firefly: path.resolve('js/SUIT.js')};

module.exports = require(firefly_root + '/buildScript/webpack.config.js').default({firefly_root, name, entry});
