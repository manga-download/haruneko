import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yaoime',
        title: 'Yaoi.me',
    },
    container: {
        url: 'https://yaoi.me/series/52254/black-blood',
        id: '/series/52254/black-blood',
        title: 'Black Blood'
    },
    child: {
        id: '/chapter/52254/5446125',
        title: 'Ch.156.02 [en]'
    },
    entry: {
        index: 0,
        size: 91_042,
        type: 'image/webp'
    }
}).AssertWebsite();