
const assert = require('assert');

describe('webpack.base.js test case', () => {
    const baseConfig = require('../../lib/webpack.base.js')
    it('entry', () => {
        assert.equal(baseConfig.entry.index, '/Users/zhuqitao/develop/webpack/chap04/test/test/smoke/template/src/index/index.js');
        assert.equal(baseConfig.entry.search, '/Users/zhuqitao/develop/webpack/chap04/test/test/smoke/template/src/search/index.js');
    });
});