import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'montetai',
        title: 'MonteTai'
    },
    container: {
        url: 'https://montetaiscanlator.xyz/manga/o-filho-do-duque-regressado-e-um-assassino/',
        id: JSON.stringify({ post: '3188', slug: '/manga/o-filho-do-duque-regressado-e-um-assassino/' }),
        title: 'O Filho do Duque Regressado é um Assassino'
    },
    child: {
        id: '/manga/o-filho-do-duque-regressado-e-um-assassino/capitulo-135/',
        title: 'Capitulo 135'
    },
    entry: {
        index: 3,
        size: 337_080,
        type: 'image/webp'
    }
}).AssertWebsite();