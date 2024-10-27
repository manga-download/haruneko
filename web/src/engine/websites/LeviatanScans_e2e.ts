import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'leviatanscans',
        title: 'LeviatanScans'
    },
    container: {
        url: 'https://lscomic.com/manga/my-dad-is-too-strong/',
        id: JSON.stringify({ post: '320', slug: '/manga/my-dad-is-too-strong/' }),
        title: 'My Dad is Too Strong'
    },
    child: {
        id: '/manga/my-dad-is-too-strong/chapter-1/',
        title: 'Chapter 1',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 708_019,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();