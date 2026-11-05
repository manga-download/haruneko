import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'dxdfansub',
        title: 'DxD Fansub'
    },
    container: {
        url: 'https://dxdfansub.com/seri/sis-diyari/',
        id: '/seri/sis-diyari/',
        title: 'Sis Diyarı'
    },
    child: {
        id: '/seri/sis-diyari/bolum-16/',
        title: 'Bölüm 16'
    },
    entry: {
        index: 0,
        size: 477_718,
        type: 'image/webp'
    }
}).AssertWebsite();