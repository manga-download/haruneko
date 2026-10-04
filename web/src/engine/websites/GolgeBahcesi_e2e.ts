import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'golgebahcesi',
        title: 'Gölge Bahçesi'
    },
    container: {
        url: 'https://golgebahcesi.com/manga/ozel-memur',
        id: 'ozel-memur',
        title: 'Özel Memur'
    },
    child: {
        id: '6a21d8d7924f34d61607cc76',
        title: 'Bölüm 4'
    },
    entry: {
        index: 0,
        size: 95_954,
        type: 'image/webp'
    }
}).AssertWebsite();