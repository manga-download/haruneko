import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'shadowmangas',
        title: 'ShadowMangas'
    },
    container: {
        url: 'https://shademanga.com/serie/Hm3h5j',
        id: 'Hm3h5j',
        title: 'Realmente No Soy El Vasallo Del Dios Demonio'
    },
    child: {
        id: 'ZFPgTd',
        title: 'Cap. 184'
    },
    entry: {
        index: 1,
        size: 284_668,
        type: 'image/webp'
    }
}).AssertWebsite();