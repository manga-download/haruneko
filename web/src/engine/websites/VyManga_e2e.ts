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
    /* Chapter id is random, cant make a proper test
    child: {
        id: 'https://aovheroes.com/rds/br/rdsd?data=s4sdqf5qs4df5qs4fvsd54fsd53f43s5d4f135sdf',
        title: 'Chapter 464.5'
    },
    entry: {
        index: 0,
        size: -1,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();