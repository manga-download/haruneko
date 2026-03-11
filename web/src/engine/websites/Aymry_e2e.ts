import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'aymry',
        title: 'Aymry',
    },
    container: {
        url: 'https://www.aymry.com/book/23305/',
        id: '/book/23305/',
        title: '异样的体质'
    },
    child: {
        id: '/chapter/23305/1182950.html',
        title: '第1话'
    },
    entry: {
        index: 0,
        size: 268_061,
        type: 'image/jpeg'
    }
}).AssertWebsite();