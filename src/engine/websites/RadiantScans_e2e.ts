import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'radiantscans',
        title: 'Radiant Scans'
    },
    container: {
        url: 'https://radiantscans.com/series/1718323201-zombie-city/',
        id: '/series/1718323201-zombie-city/',
        title: 'City of The Ravenous'
    },
    child: {
        id: '/1718323201-city-of-the-ravenous-chapter-12/',
        title: 'Chapter 12'
    },
    entry: {
        index: 1,
        size: 2_069_371,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();