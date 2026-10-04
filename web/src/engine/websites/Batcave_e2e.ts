import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'batcave',
        title: 'Batcave',
        timeout: 30_000
    },
    container: {
        url: 'https://batcave.biz/38537-pounds-of-power.html',
        id: '/38537-pounds-of-power.html',
        title: 'Pounds of Power'
    },
    child: {
        id: '/reader/38537/273548',
        title: '#1'
    },
    entry: {
        index: 0,
        size: 289_896,
        type: 'image/webp'
    }
}).AssertWebsite();