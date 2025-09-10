import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'eldermanga',
        title: 'ElderManga'
    },
    container: {
        url: 'https://eldermanga.com/manga/18/antik-cag-kadim-nehirin-varisi-',
        id: '/manga/18/antik-cag-kadim-nehirin-varisi-',
        title: 'Antik Çağ: Kadim Nehir\' in Varisi'
    },
    child: {
        id: '/manga/18/antik-cag-kadim-nehirin-varisi-/1041/50-bolum',
        title: 'Bölüm 50'
    },
    entry: {
        index: 0,
        size: 29_814,
        type: 'image/jpeg'
    }
}).AssertWebsite();