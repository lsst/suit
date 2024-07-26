/* eslint-env node */

const baseConfig = require('../../__jest__/jest.base.config');

module.exports = {
    ...baseConfig,
    coverageDirectory: '../../build/dist/reports/suit',
    moduleNameMapper: {
        ...baseConfig.moduleNameMapper,
        '^firefly/(.*)$': '<rootDir>/../../../firefly/src/firefly/js/$1'
    }
};