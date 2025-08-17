import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangadna',
        title: 'MangaDNA'
    },
    container: {
        url: 'https://mangadna.com/manga/skeleton-soldier-couldnt-protect-the-dungeon',
        id: '/manga/skeleton-soldier-couldnt-protect-the-dungeon',
        title: 'Skeleton Soldier Couldn\'t Protect the Dungeon'
    },
    child: {
        id: '/manga/skeleton-soldier-couldnt-protect-the-dungeon/chapter-333',
        title: 'Chapter 333'
    },
    entry: {
        index: 0,
        size: 41_126,
        type: 'image/jpeg'
    }
}).AssertWebsite();