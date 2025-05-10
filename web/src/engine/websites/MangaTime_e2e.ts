import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatime',
        title: 'MangaTime',
    },
    container: {
        url: 'https://mangatime.org/manga/Blue-Lock/',
        id: '/manga/Blue-Lock/',
        title: 'Blue Lock'
    },
    child: {
        id: '/manga/Blue-Lock/chapter-1',
        title: 'Chapter - 1'
    },
    entry: {
        index: 2,
        size: 82_806,
        type: 'image/jpeg'
    }
}).AssertWebsite();