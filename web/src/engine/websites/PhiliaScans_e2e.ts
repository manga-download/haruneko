import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'philiascans',
        title: 'Philia Scans'
    },
    container: {
        url: 'https://philiascans.org/series/how-i-became-king-by-eating-monsters',
        id: 'how-i-became-king-by-eating-monsters',
        title: 'How I Became King by Eating Monsters'
    },
    child: {
        id: 'chapter-01',
        title: 'Ch.1'
    },
    entry: {
        index: 1,
        size: 1_210_233,
        type: 'image/png'
    }
}).AssertWebsite();