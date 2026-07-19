import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manganight',
        title: 'Manga Night',
    },
    container: {
        url: 'https://manganight.com.br/manga/chainsaw-man',
        id: '/manga/chainsaw-man',
        title: 'Chainsaw Man',
    },
    child: {
        id: '-2597662703',
        title: 'Capítulo 96',
    },
    entry: {
        index: 0,
        size: 433_285,
        type: 'image/png'
    }
}).AssertWebsite();