import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'fatescans',
        title: 'Fate Scans'
    },
    container: {
        url: 'https://fatescans.com/series/alive',
        id: '/series/alive',
        title: 'Alive'
    },
    child: {
        id: '/series/alive/chapter-0.00',
        title: '0. Bölüm'
    },
    entry: {
        index: 0,
        size: 189_540,
        type: 'image/webp'
    }
}).AssertWebsite();