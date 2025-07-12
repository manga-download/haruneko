import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tecnoscan',
        title: 'Tecno Scan'
    },
    container: {
        url: 'https://tecnovoid.xyz/manga/absolute-sword-sense/',
        id: '/manga/absolute-sword-sense/',
        title: 'Absolute Sword Sense'
    },
    child: {
        id: '/absolute-sword-sense-chapter-115-4/',
        title: 'Chapter 115.4'
    },
    entry: {
        index: 0,
        size: 1_153_018,
        type: 'image/webp'
    }
}).AssertWebsite();