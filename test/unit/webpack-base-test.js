
const assert = require('assert');

describe('webpack.base.js test case', () => {
    const baseConfig = require('../../lib/webpack.base.js')
    it('entry', () => {
        assert.equal(baseConfig.entry.index.includes('smoke/template/src/index/index.js'), true);
        assert.equal(baseConfig.entry.search.includes('smoke/template/src/search/index.js'), true);
    });
});