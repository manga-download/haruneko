import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nekopost',
        title: 'NekoPost',
    },
    container: {
        url: 'https://www.nekopost.net/manga/15660',
        id: '/manga/15660',
        title: 'Toshiue Elite Onna Kishi ga Boku no Mae de dake Kawaii'
    },
    child: {
        id: '/manga/15660/13.1',
        title: 'Ch.13.1 - 13.1'
    },
    entry: {
        index: 0,
        size: 292_537,
        type: 'image/jpeg'
    }
}).AssertWebsite();