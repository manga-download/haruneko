import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangagun',
        title: 'NihonKuni'
    },
    container: {
        url: 'https://nihonkuni.com/manga-oshi-no-ko-raw.html',
        id: '/manga-oshi-no-ko-raw.html',
        title: 'OSHI NO KO - RAW'
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
}).AssertWebsite();