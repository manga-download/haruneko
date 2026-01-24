import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'westmanga',
        title: 'WestManga'
    },
    container: {
        url: 'https://westmanga.me/comic/bad-born-blood',
        id: 'bad-born-blood',
        title: 'Bad Born Blood'
    },
    child: {
        id: 'bad-born-blood-chapter-70-bahasa-indonesia',
        title: '70'
    },
    entry: {
        index: 1,
        size: 152_636,
        type: 'image/webp'
    }
}).AssertWebsite();