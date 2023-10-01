import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'luminousscans',
        title: 'Luminous Scans'
    },
    container: {
        url: 'https://luminousscans.com/series/1694588401-sword-king-survival-story/',
        id: '/series/1694588401-sword-king-survival-story/',
        title: 'Survival Story of a Sword King in a Fantasy World'
    },
    child: {
        id: '/survival-story-of-a-sword-king-in-a-fantasy-world-chapter-184/',
        title: 'Chapter 184'
    },
    entry: {
        index: 0,
        size: 709_967,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());