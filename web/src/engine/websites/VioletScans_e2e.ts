import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'violetscans',
        title: 'Violet Scans',
    },
    container: {
        url: 'https://violetscans.org/comics/101st-confession/',
        id: '/comics/101st-confession/',
        title: '101st Confession',
    },
    child: {
        id: '/101st-confession-chapter-1/',
        title: 'Chapter 1',
        timeout: 15_000,
    },
    entry: {
        index: 0,
        size: 1_015_164,
        type: 'image/webp',
    },
}).AssertWebsite();
