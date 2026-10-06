import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangitto',
        title: 'Mangitto'
    },
    container: {
        url: 'https://mangtto.com/manga/berserk',
        id: 'berserk',
        title: 'Berserk'
    },
    child: {
        id: '/manga/berserk/386',
        title: 'Bölüm 386'
    },
    entry: {
        index: 2,
        size: 747_640,
        type: 'image/webp'
    }
}).AssertWebsite();