import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhuaga',
        title: 'Manhuaga'
    },
    container: {
        url: 'https://manhua-ga.org/manga/klpsl/',
        id: JSON.stringify({ post: '1844', slug: '/manga/klpsl/' }),
        title: 'Keep a Low Profile, Sect Leader'
    },
    child: {
        id: '/manga/klpsl/chapter-465/',
        title: 'Chapter 465'
    },
    entry: {
        index: 3,
        size: 596_887,
        type: 'image/jpeg'
    }
}).AssertWebsite();