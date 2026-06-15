import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ninemanga-it',
        title: 'NineMangaIT'
    },
    container: {
        url: 'https://it.niadd.com/manga/Level_Up_with_the_Gods.html',
        id: '/manga/Level_Up_with_the_Gods.html',
        title: 'Level Up With The Gods',
    },
    child: {
        id: '/chapter/Level_Up_with_the_Gods_35/970365/',
        title: 'Level Up with the Gods 35',
    },
    entry: {
        index: 1,
        size: 262482,
        type: 'image/webp'
    }
}).AssertWebsite();