import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'toti',
        title: 'To-Ti'
    },
    container: {
        url: 'https://to-ti.in/product/yasegaman',
        id: '/product/yasegaman',
        title: '痩我慢の説'
    },
    child: {
        id: '/story/yasegaman01',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 410_238,
        type: 'image/jpeg'
    }
}).AssertWebsite();