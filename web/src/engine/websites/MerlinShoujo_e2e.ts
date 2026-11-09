import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'merlinshoujo',
        title: 'Merlin Shoujo'
    },
    container: {
        url: 'https://merlinshoujo.com/manga/dont-mind-me-daddy/',
        id: '/manga/dont-mind-me-daddy/',
        title: 'Beni Düşünme Baba',
    },
    child: {
        id: '/beni-dusunme-baba-bolum-81/',
        title: 'Bölüm 81',
        timeout: 15_000
    },
    entry: {
        index: 3,
        size: 372_132,
        type: 'image/webp'
    }
}).AssertWebsite();