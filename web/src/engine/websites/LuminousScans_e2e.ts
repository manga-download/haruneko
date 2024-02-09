import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'luminousscans',
        title: 'Luminous Scans'
    },
    container: {
        url: 'https://lumitoon.com/series/1706860801-sword-king-survival-story/',
        id: '/series/1706860801-sword-king-survival-story/',
        title: 'Survival Story of a Sword King in a Fantasy World'
    },
    child: {
        id: '/1706860801-survival-story-of-a-sword-king-in-a-fantasy-world-chapter-184/',
        title: 'Chapter 184'
    },
    entry: {
        index: 0,
        size: 1_961_579,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());