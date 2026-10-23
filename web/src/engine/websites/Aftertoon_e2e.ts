import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'aftertoon',
        title: 'Aftertoon',
    },
    container: {
        url: 'https://aftertoon.com/manga/kactikca-yakinlasanlar',
        id: '/manga/kactikca-yakinlasanlar',
        title: 'Kaçtıkça Yakınlaşanlar'
    },
    child: {
        id: '/manga/kactikca-yakinlasanlar/bolum-22',
        title: 'Bölüm 22'
    },
    entry: {
        index: 1,
        size: 262_524,
        type: 'image/webp'
    }
}).AssertWebsite();