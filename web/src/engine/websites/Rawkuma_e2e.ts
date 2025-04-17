import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rawkuma',
        title: 'Rawkuma'
    },
    container: {
        url: 'https://rawkuma.net/manga/jujutsu-kaisen/',
        id: '/manga/jujutsu-kaisen/',
        title: 'Jujutsu Kaisen'
    },
    child: {
        id: '/jujutsu-kaisen-chapter-1/',
        title: 'Chapter 1',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 158_262,
        type: 'image/jpeg'
    }
}).AssertWebsite();