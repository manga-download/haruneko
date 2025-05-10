import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangafr',
        title: 'Manga FR',
    },
    container: {
        url: 'https://www.mangafr.org/series/cooking-karine',
        id: '/series/cooking-karine',
        title: '#Cooking Karine'
    },
    child: {
        id: '/scan/14610',
        title: 'Volume 1'
    },
    entry: {
        index: 0,
        size: 276_293,
        type: 'image/webp'
    }
}).AssertWebsite();