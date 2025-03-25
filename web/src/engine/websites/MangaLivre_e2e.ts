import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangalivre',
        title: 'MangaLivre'
    },
    container: {
        url: 'https://mangalivre.ru/manga/solo-max-level-newbie/',
        id: '/manga/solo-max-level-newbie/',
        title: 'Solo Max-Level Newbie'
    },
    child: {
        id: '/manga/solo-max-level-newbie/capitulo-196/',
        title: 'Capítulo 196'
    },
    entry: {
        index: 0,
        size: 78_586,
        type: 'image/webp'
    }
}).AssertWebsite();