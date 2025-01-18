import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'omegascans',
        title: 'OmegaScans'
    },
    container: {
        url: 'https://omegascans.org/series/trapped-in-the-academys-eroge',
        id: JSON.stringify({ id: '8', slug: 'trapped-in-the-academys-eroge' }),
        title: `Trapped in the Academy's Eroge`
    },
    child: {
        id: JSON.stringify({ id: '3245', slug: 'chapter-76' }),
        title: 'Chapter 76'
    },
    entry: {
        index: 1,
        size: 1_577_008,
        type: 'image/jpeg'
    }
}).AssertWebsite();
