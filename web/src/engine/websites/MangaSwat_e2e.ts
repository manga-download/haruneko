import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaswat',
        title: 'MangaSwat'
    },
    container: {
        url: 'https://meshmanga.com/series/66587',
        id: '66587',
        title: 'Emperor And The Female Knight'
    },
    child: {
        id: '1664788',
        title: '184 FREE'
    },
    entry: {
        index: 1,
        size: 218_922,
        type: 'image/webp'
    }
}).AssertWebsite();