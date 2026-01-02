import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'klmanga',
        title: 'KLManga',
    },
    container: {
        url: 'https://klz9.com/isekai-koushoku-musou-roku-isekai-tensei-no-chie-to-chikara-wo-tada-hitasura-xxxx-suru-tame-ni-tsukau.html',
        id: 'isekai-koushoku-musou-roku-isekai-tensei-no-chie-to-chikara-wo-tada-hitasura-xxxx-suru-tame-ni-tsukau',
        title: 'ISEKAI KOUSHOKU MUSOU ROKU - ISEKAI TENSEI NO CHIE TO CHIKARA WO, TADA HITASURA XXXX SURU TAME NI TSUKAU',
    },
    child: {
        id: '257744',
        title: 'Chapter 16',
    },
    entry: {
        index: 16,
        size: 386_180,
        type: 'image/jpeg',
    }
}).AssertWebsite();