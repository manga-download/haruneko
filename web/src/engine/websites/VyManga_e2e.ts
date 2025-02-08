import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'vymanga',
        title: 'VyManga'
    },
    container: {
        url: 'https://vymanga.com/manga/soul-land-iv--the-ultimate-combat',
        id: '/manga/soul-land-iv--the-ultimate-combat',
        title: 'Soul Land IV - The Ultimate Combat'
    },
    child: {
        id: '/read/soul-land-iv--the-ultimate-combat/2487071',
        title: 'Chapter 500'
    },
    entry: {
        index: 0,
        size: 202_301,
        type: 'image/jpeg'
    }
}).AssertWebsite();