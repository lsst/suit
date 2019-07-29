/* eslint-env node */

require('@babel/register')({
    presets: ['@babel/preset-env'],
    ignore: [/node_modules/]
});

var path = require('path');

var firefly_root = path.resolve(__dirname, '../../../firefly');
var name = 'suit';
var entry = {firefly: path.resolve('js/SUIT.js')};

module.exports = require(firefly_root + '/buildScript/webpack.config.js').default({firefly_root, name, entry});
