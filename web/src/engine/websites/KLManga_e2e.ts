import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'klmanga',
        title: 'KLManga'
    },
    container: {
        url: 'https://klz9.com/ybed-isekai-koushoku-musou-roku-isekai-tensei-no-chie-to-chikara-wo-tada-hitasura-xxxx-suru-tame-ni-tsukau.html',
        id: '/ybed-isekai-koushoku-musou-roku-isekai-tensei-no-chie-to-chikara-wo-tada-hitasura-xxxx-suru-tame-ni-tsukau.html',
        title: 'ISEKAI KOUSHOKU MUSOU ROKU - ISEKAI TENSEI NO CHIE TO CHIKARA WO, TADA HITASURA XXXX SURU TAME NI TSUKAU'
    },
    child: {
        id: '/jxsh-isekai-koushoku-musou-roku-isekai-tensei-no-chie-to-chikara-wo-tada-hitasura-xxxx-suru-tame-ni-tsukau-chapter-16.html',
        title: 'Chapter 16'
    },
    entry: {
        index: 0,
        size: 494_933,
        type: 'image/jpeg'
    }
}).AssertWebsite();