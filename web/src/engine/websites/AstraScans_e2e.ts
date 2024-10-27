import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'astrascans',
        title: 'AstraScans'
    },
    container: {
        url: 'https://astrascans.org/series/anti-hero/',
        id: '/series/anti-hero/',
        title: 'Anti-Hero'
    },
    child: {
        id: '/anti-hero-chapter-3/',
        title: 'Chapter 3'
    },
    entry: {
        index: 0,
        size: 176_620,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();