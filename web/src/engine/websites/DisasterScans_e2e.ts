import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'disasterscans',
        title: 'Disaster Scans'
    },
    container: {
        url: 'https://disasterscans.com/comics/17993-yuan-zun',
        id: '/comics/17993-yuan-zun',
        title: 'Yuan Zun'
    },
    child: {
        id: '/comics/17993-yuan-zun/66924-chapter-1',
        title: 'Chapter 1 - The Saint Dragon of Zhou Family'
    },
    entry: {
        index: 0,
        size: 92_454,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();