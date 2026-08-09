import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'shadowmangas',
        title: 'ShadowMangas'
    },
    container: {
        url: 'https://shademanga.com/serie/local/38721/',
        id: '38721',
        title: 'Realmente No Soy El Vasallo Del Dios Demonio'
    },
    child: {
        id: '894436',
        title: 'Cap. 184'
    },
    entry: {
        index: 1,
        size: 284_668,
        type: 'image/webp'
    }
}).AssertWebsite();