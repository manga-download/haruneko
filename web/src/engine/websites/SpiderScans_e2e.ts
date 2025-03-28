import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'spiderscans',
        title: 'Spider Scans'
    },
    container: {
        url: 'https://spiderscans.xyz/manga/my-god-tier-leveling-system/',
        id: JSON.stringify({ post: '190', slug: '/manga/my-god-tier-leveling-system/' }),
        title: 'My God Tier Leveling System'
    },
    child: {
        id: '/manga/my-god-tier-leveling-system/chapter-133/',
        title: 'Chapter 133'
    },
    entry: {
        index: 2,
        size: 120_648,
        type: 'image/webp'
    }
}).AssertWebsite();