import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ruyamanganet',
        title: 'Rüya Manga (.net)'
    },
    container: {
        url: 'https://ruyamanga.net/manga/kocami-nasil-kazanirim/',
        id: JSON.stringify({ post: '791', slug: '/manga/kocami-nasil-kazanirim/' }),
        title: 'Kocamı Nasıl Kazanırım'
    },
    child: {
        id: '/manga/kocami-nasil-kazanirim/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 298_580,
        type: 'image/jpg'
    }
}).AssertWebsite();