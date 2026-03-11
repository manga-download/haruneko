import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'milasub',
        title: 'Mila Sub'
    },
    container: {
        url: 'https://www.millascan.com/manga/ilkask/',
        id: JSON.stringify({ post: '39329', slug: '/manga/ilkask/' }),
        title: '#İlkAşk'
    },
    child: {
        id: '/manga/ilkask/6-bolum/',
        title: '6.Bölüm'
    }, /* Need Login
    entry: {
        index: 2,
        size: 843_939,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();