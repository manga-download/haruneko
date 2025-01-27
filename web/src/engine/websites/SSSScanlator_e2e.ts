import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sssscanlator',
        title: 'SSS Scanlator',
    },
    container: {
        url: 'https://ssstoons.com/manga/a-lenda-do-general-estelar/',
        id: '/manga/a-lenda-do-general-estelar/',
        title: 'A Lenda do General Estelar',
    },
    child: {
        id: '/a-lenda-do-general-estelar-capitulo-154/',
        title: 'Capítulo 154',
        timeout: 15_000,
    },
    entry: {
        index: 1,
        size: 3_571_660,
        type: 'image/jpeg',
    }
}).AssertWebsite();