import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangadotnet',
        title: 'MangaDotNet'
    },
    container: {
        url: 'https://mangadot.net/manga/41',
        id: '41',
        title: 'ONE PIECE'
    },
    child: {
        id: JSON.stringify({ id: 489413, source: 'user' }),
        title: 'Chapter 1185 [en] TCB Scans'
    },
    entry: {
        index: 0,
        size: 286_318,
        type: 'image/webp'
    }
}).AssertWebsite();
