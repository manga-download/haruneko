import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangas',
        title: 'MangAs'
    },
    container: {
        url: 'https://m440.in/manga/one-piece',
        id: '/manga/one-piece',
        title: 'One Piece'
    },
    child: {
        id: '/manga/one-piece/1097-gpap2',
        title: '1097 : Ginny'
    },
    entry: {
        index: 6,
        size: 278_405,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();