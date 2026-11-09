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
        id: '/manga/jujutsu-kaisen/chapter-1.101436/',
        title: 'Chapter 1',
    },
    entry: {
        index: 0,
        size: 158_262,
        type: 'image/jpeg'
    }
}).AssertWebsite();