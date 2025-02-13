import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tcbscans',
        title: 'TCB Scans'
    },
    container: {
        url: 'https://tcbonepiecechapters.me/mangas/1/ace-novel-manga-adaptation',
        id: '/mangas/1/ace-novel-manga-adaptation',
        title: 'Ace Novel - Manga Adaptation'
    },
    child: {
        id: '/chapters/276/ace-novel-manga-adaptation-chapter-4-review-1687770263',
        title: 'Chapter 4 : Final Chapter: Ace\'s Adventure'
    },
    entry: {
        index: 0,
        size: 1_410_846,
        type: 'image/png'
    }
}).AssertWebsite();