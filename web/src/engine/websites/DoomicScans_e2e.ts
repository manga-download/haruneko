import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'doomicscans',
        title: 'Doomic Scans'
    },
    container: {
        url: 'https://doomcomic.xyz/manga/absolute-sword-sense/',
        id: '/manga/absolute-sword-sense/',
        title: 'Absolute Sword Sense'
    },
    child: {
        id: '/absolute-sword-sense-chapter-92/',
        title: 'Chapter 92'
    },
    entry: {
        index: 1,
        size: 1_395_498,
        type: 'image/jpeg'
    }
}).AssertWebsite();