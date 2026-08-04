import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hotmanga',
        title: 'Hot-Manga'
    },
    container: {
        url: 'https://www.hot-manga.fr/produit/le-bureau-des-tentations/112',
        id: '112',
        title: 'Le bureau des tentations'
    },
    child: {
        id: '112',
        title: 'Le bureau des tentations'
    },
    entry: {
        index: 1,
        size: 1_557_108,
        type: 'image/png'
    }
}).AssertWebsite();