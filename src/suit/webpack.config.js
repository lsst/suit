/* eslint-env node */

const path = require('path');
require('@babel/register')({
    presets: ['@babel/preset-env'],
    ignore: [/node_modules/]
});

module.exports= (env, argv) => {
    const firefly_root = path.resolve(__dirname, '../../../firefly');
    const entry = {firefly: path.resolve('js/SUIT.js')};
    return require(firefly_root + '/buildScript/webpack.config.js').default({firefly_root, name:'suit', entry});
}
