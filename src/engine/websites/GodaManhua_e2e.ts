import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'godamanhua',
        title: 'GodaManhua',
    },
    container: {
        url: 'https://baozimh.org/manga/wuliandianfeng-pikapi',
        id: '/manga/wuliandianfeng-pikapi',
        title: '武炼巅峰'
    },
    child: {
        id: './chapter/getinfo?m=12&c=1690342',
        title: '世界终源篇-封印印起'
    },
    entry: {
        index: 1,
        size: 167_270,
        type: 'image/webp'
    }
}).AssertWebsite();