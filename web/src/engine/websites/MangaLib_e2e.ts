import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Same chapter from multiple translators
new TestFixture({
    plugin: {
        id: 'mangalib',
        title: 'MangaLib'
    },
    container: {
        url: 'https://mangalib.org/ru/manga/7965--chainsaw-man',
        id: '7965--chainsaw-man',
        title: 'Человек-бензопила'
    },
    child: {
        id: './manga/7965--chainsaw-man/chapter?volume=1&number=1&branch_id=4667',
        title: '1 - Пёс и бензопила [Nippa]'
    },
    entry: {
        index: 4,
        size: 314_272,
        type: 'image/webp'
    }
}).AssertWebsite();

// CASE: Chapter from single translator
new TestFixture({
    plugin: {
        id: 'mangalib',
        title: 'MangaLib'
    },
    container: {
        url: 'https://mangalib.org/ru/manga/11571--chitra',
        id: '11571--chitra',
        title: 'Читра'
    },
    child: {
        id: './manga/11571--chitra/chapter?volume=1&number=55',
        title: '55 - Конец 1 сезона'
    },
    entry: {
        index: 0,
        size: 308_650,
        type: 'image/jpeg'
    }
}).AssertWebsite();