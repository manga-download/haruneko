import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangagun',
        title: 'MangaGun'
    },
    container: {
        url: 'https://mangagun.net/manga-oshi-no-ko-raw.html',
        id: '/manga-oshi-no-ko-raw.html',
        title: 'OSHI NO KO'
    },
    child: {
        id: '/read-oshi-no-ko-raw-chapter-146.html',
        title: 'Chapter 146'
    },
    entry: {
        index: 0,
        size: 297_654,
        type: 'image/jpeg',
    }
};

new TestFixture(config).AssertWebsite();