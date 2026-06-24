import { TestFixture } from '../../../test/WebsitesFixture';

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