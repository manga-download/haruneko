import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'readmanga',
        title: 'ReadManga'
    },
    container: {
        url: 'https://zz.readmanga.io/vseveduchii_chitatel__A5664', // Randomly redirects to 'https://web.usagi.one/omniscient_reader_s_viewpoint'
        id: '/vseveduchii_chitatel__A5664',
        title: 'Всеведущий читатель'
    },
    child: {
        id: '/vseveduchii_chitatel__A5664/vol1/100?mtr=1',
        title: '1 - 100 То, что невозможно изменить - часть 2'
    },
    entry: {
        index: 0,
        size: 950_618,
        type: 'image/jpeg'
    }
}).AssertWebsite();

new TestFixture({
    plugin: {
        id: 'readmanga',
        title: 'ReadManga'
    },
    container: {
        url: 'https://zz.readmanga.io/van_pis__A5664', // Randomly redirects to 'https://web.usagi.one/van_pis'
        id: '/van_pis__A5664',
        title: 'Ван Пис'
    },
    child: {
        id: '/van_pis__A5664/vol100/1010?mtr=1',
        title: '100 - 1010 Королевская воля'
    },
    entry: {
        index: 1,
        size: 554_563,
        type: 'image/png'
    }
}).AssertWebsite();