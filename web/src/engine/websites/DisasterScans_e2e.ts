import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'disasterscans',
        title: 'Disaster Scans'
    },
    container: {
        url: 'https://disasterscans.com/comics/17993-yuan-zun',
        id: '17993',
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

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());