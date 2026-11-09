import { TestFixture } from '../../../test/WebsitesFixture';

// CASE : Regular tests
new TestFixture({
    plugin: {
        id: 'doujindesu',
        title: 'DoujinDesu',
    },
    container: {
        url: 'https://doujin.desu.xxx/manga/hero-villain',
        id: 'hero-villain',
        title: 'Hero Villain'
    },
    child: {
        id: 'ef012c1e-e81e-4895-9105-fbd83a597f6a',
        title: 'Chapter 96'
    },
    entry: {
        index: 1,
        size: 57_002,
        type: 'image/webp'
    }
}).AssertWebsite();

// CASE : HTML entities in pictures URLS (chapters 1 to 62)
new TestFixture({
    plugin: {
        id: 'doujindesu',
        title: 'DoujinDesu',
    },
    container: {
        url: 'https://doujin.desu.xxx/manga/im-the-only-man-on-the-military-base',
        id: 'im-the-only-man-on-the-military-base',
        title: `I'm the Only Man on the Military Base`
    },
    child: {
        id: '5abc79c4-ea0e-4a4d-ad15-765bbc19a665',
        title: 'Chapter 62'
    },
    entry: {
        index: 0,
        size: 348_524,
        type: 'image/webp'
    }
}).AssertWebsite();