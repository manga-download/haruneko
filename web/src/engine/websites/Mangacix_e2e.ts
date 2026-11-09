import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangacix',
        title: 'Mangacix'
    },
    container: {
        url: 'https://mangacix.net/books/9030/chainsaw-man',
        id: '9030',
        title: 'Chainsaw Man'
    },
    child: {
        id: '1',
        title: '1. Bölüm'
    },
    entry: {
        index: 0,
        size: 552_974,
        type: 'image/webp'
    }
}).AssertWebsite();