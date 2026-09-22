import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'inkapk',
        title: 'Inkapk',
    },
    container: {
        url: 'https://inkapk.net/obras/a-visit-to-hell/',
        id: '{"slug":"/obras/a-visit-to-hell/"}',
        title: 'A Visit to Hell',
    },
    child: {
        id: '/obras/a-visit-to-hell/capitulo-01/',
        title: 'Capítulo 01',
    },
    entry: {
        index: 0,
        size: 87_654,
        type: 'image/webp',
    },
}).AssertWebsite();
