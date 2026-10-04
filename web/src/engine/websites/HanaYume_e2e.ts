import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hanayume',
        title: 'HanaYume'
    },
    container: {
        url: 'https://hanayume.com/series/34bf61d51ebc3',
        id: '/series/34bf61d51ebc3',
        title: '死神の職場'
    },
    child: {
        id: '/episodes/3f6f28afc6619',
        title: '1話',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 896_321,
        type: 'image/png',
    }
}).AssertWebsite();