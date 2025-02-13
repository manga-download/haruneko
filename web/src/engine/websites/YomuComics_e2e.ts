import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yomucomics',
        title: 'Yomu Comics',
    },
    container: {
        url: 'https://yomucomics.com/manga/a-lenda-do-general-estelar/',
        id: '/manga/a-lenda-do-general-estelar/',
        title: 'A Lenda do General Estelar',
    },
    child: {
        id: '/a-lenda-do-general-estelar-capitulo-00/',
        title: 'Capítulo 00',
        timeout: 15_000,
    },
    entry: {
        index: 1,
        size: 1_056_884,
        type: 'image/jpeg',
    }
}).AssertWebsite();