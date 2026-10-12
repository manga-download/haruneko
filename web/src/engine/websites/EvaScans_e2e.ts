import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'evascans',
        title: 'Eva Scans',
    },
    container: {
        url: 'https://evascans.net/series/a-bad-example-of-a-perfect-curse/',
        id: '/series/a-bad-example-of-a-perfect-curse/',
        title: 'A Bad Example of a Perfect Curse',
    },
    child: {
        id: '/a-bad-example-of-a-perfect-curse-chapter-41/',
        title: 'Chapter 41',
        timeout: 15_000
    },
    entry: {
        index: 2,
        size: 1_053_680,
        type: 'image/webp',
    },
}).AssertWebsite();
