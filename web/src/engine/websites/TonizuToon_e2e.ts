import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tonizutoon',
        title: 'Tonizu Toon'
    }, /* Need Login
    container: {
        url: 'https://tonizu.top/manga/dana/',
        id: JSON.stringify({ post: '186', slug: '/manga/dana/' }),
        title: 'DANA'
    },
    child: {
        id: '/manga/dana/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 1_258_937,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();