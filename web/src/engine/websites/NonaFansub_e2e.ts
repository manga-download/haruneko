import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nonafansub',
        title: 'Nona Fansub'
    },
    container: {
        url: 'https://nonafansub.com/manga/olsen-bile/',
        id: JSON.stringify({ post: '538', slug: '/manga/olsen-bile/' }),
        title: 'Ölsen Bile'
    },
    child: {
        id: '/manga/olsen-bile/bolum-1/',
        title: 'Bölüm 1'
    }, /* need login to access the images
    entry: {
        index: 0,
        size: 123_456,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();