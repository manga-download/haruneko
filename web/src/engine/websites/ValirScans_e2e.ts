import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'valirscans',
        title: 'Valir Scans'
    },
    container: {
        url: 'https://valirscans.org/series/comic/growing-the-seed-of-evil',
        id: 'growing-the-seed-of-evil',
        title: 'Growing the Seed of Evil'
    },
    child: {
        id: '/series/comic/growing-the-seed-of-evil/chapter/1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 171_856,
        type: 'image/webp'
    }
}).AssertWebsite();