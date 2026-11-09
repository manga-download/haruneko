import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'vermanhwa',
        title: 'VerManhwa'
    },
    container: {
        url: 'https://vermanhwa.com/manga/dejaa-que-te-ensenee/',
        id: JSON.stringify({ post: '2670', slug: '/manga/dejaa-que-te-ensenee/' }),
        title: 'Deja que te enseñe'
    },
    child: {
        id: '/manga/dejaa-que-te-ensenee/capitulo-47/',
        title: 'Capitulo 47'
    },
    entry: {
        index: 0,
        size: 97_745,
        type: 'image/jpeg'
    }
}).AssertWebsite();