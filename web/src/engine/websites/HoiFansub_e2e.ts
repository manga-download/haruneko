import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hoifansub',
        title: 'Hoi Fansub'
    },
    container: {
        url: 'https://hoifansub.com/manga/love-strongly/',
        id: JSON.stringify({ post: '609', slug: '/manga/love-strongly/' }),
        title: 'Love Strongly, Surprise!'
    },
    child: {
        id: '/manga/love-strongly/bolum-12/',
        title: 'Bölüm 12'
    }, /*
    entry: {    //Login needed
        index: 0,
        size: -1,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();