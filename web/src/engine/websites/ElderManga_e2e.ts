import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'eldermanga',
        title: 'ElderManga'
    },
    container: {
        url: 'https://eldermanga.com/manga/18/antik-cag-kadim-irmakin-varisi',
        id: '/manga/18/antik-cag-kadim-irmakin-varisi',
        title: `Antik Çağ: Kadim Irmak'ın Varisi`
    },
    child: {
        id: '/manga/18/antik-cag-kadim-irmakin-varisi/1041/50-bolum',
        title: 'Bölüm 50'
    },
    entry: {
        index: 1,
        size: 29_814,
        type: 'image/jpeg'
    }
}).AssertWebsite();