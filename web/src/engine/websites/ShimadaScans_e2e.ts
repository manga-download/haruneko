import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'shimadascans',
        title: 'Shimadascans'
    },
    container: {
        url: 'https://shimascans.com/series/a-gate-opened-on-my-first-day-as-a-politician/',
        id: '/series/a-gate-opened-on-my-first-day-as-a-politician/',
        title: 'A Gate Opened on my First Day as a Politician',
    },
    child: {
        id: '/a-gate-opened-on-my-first-day-as-a-politician-chapter-21/',
        title: 'Chapter 21',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 589_810,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());