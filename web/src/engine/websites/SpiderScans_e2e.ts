import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'spiderscans',
        title: 'Spider Scans'
    },
    container: {
        url: 'https://spidyscans.xyz/manga/my-god-tier-leveling-system/',
        id: JSON.stringify({ post: '1911', slug: '/manga/my-god-tier-leveling-system/' }),
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
};

new TestFixture(config).AssertWebsite();