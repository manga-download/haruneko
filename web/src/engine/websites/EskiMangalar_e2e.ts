import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'eskimangalar',
        title: 'Eski Mangalar'
    },
    container: {
        url: 'https://eskimangalar.com/manga/tarihin-en-guclu-vucut-yetisimcisi',
        id: 'tarihin-en-guclu-vucut-yetisimcisi',
        title: 'Tarihin En Güçlü Vücut Yetişimcisi'
    },
    child: {
        id: '/manga/tarihin-en-guclu-vucut-yetisimcisi/140-bolum-oku',
        title: 'Bölüm 140'
    },
    entry: {
        index: 3,
        size: 121_108,
        type: 'image/avif'
    }
}).AssertWebsite();