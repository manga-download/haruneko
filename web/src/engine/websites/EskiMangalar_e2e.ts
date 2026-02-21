import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'eskimangalar',
        title: 'Eski Mangalar'
    },
    container: {
        url: 'https://eskimangalar.com/manga/8/tarihin-en-guclu-vucut-yetisimcisi',
        id: '/manga/8/tarihin-en-guclu-vucut-yetisimcisi',
        title: 'Tarihin En Güçlü Vücut Yetişimcisi'
    },
    child: {
        id: '/manga/8/tarihin-en-guclu-vucut-yetisimcisi/2859/140-bolum',
        title: 'Bölüm 140'
    },
    entry: {
        index: 3,
        size: 439_285,
        type: 'image/jpeg'
    }
}).AssertWebsite();