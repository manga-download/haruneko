import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatime',
        title: 'MangaTime',
    },
    container: {
        url: 'https://mangatime.org/manga/blue-Lock',
        id: '697df7820c5d340ac154519f/blue-lock',
        title: 'بلو لوك'
    },
    child: {
        id: '1',
        title: 'Chapter - 1'
    },
    entry: {
        index: 2,
        size: 30_896,
        type: 'image/webp'
    }
}).AssertWebsite();