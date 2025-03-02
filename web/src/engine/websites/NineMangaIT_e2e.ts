import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ninemanga-it',
        title: 'NineMangaIT'
    },
    container: {
        url: 'https://it.ninemanga.com/manga/Level+Up+with+the+Gods.html',
        id: '/manga/Level+Up+with+the+Gods.html',
        title: 'Level Up with the Gods',
    },
    child: {
        id: '/chapter/Level%20Up%20with%20the%20Gods/970365.html',
        title: '35',
    },
    entry: {
        index: 1,
        size: 869_059,
        type: 'image/jpeg'
    }
}).AssertWebsite();