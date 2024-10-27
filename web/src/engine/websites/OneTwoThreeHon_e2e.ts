import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'onetwothreehon',
        title: '123hon'
    },
    container: {
        url: 'https://www.123hon.com/polca/web-comic/spxsp/',
        id: '/polca/web-comic/spxsp/',
        title: '異世界温泉冒険譚~スプラッシュ×スプラッシュ~',
    },
    child: {
        id: '/vw/spxsp/sv_pt000644b1883c326d_1a/',
        title: '第1話(1/2)'
    },
    entry: {
        index: 0,
        size: 1_468_883,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();