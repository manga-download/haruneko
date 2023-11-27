import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hunterscan-en',
        title: 'Hunters Scan (English)'
    },
    container: {
        url: 'https://en.huntersscan.xyz/series/the-blood-knights-villains/',
        id: JSON.stringify({ post: '156', slug: '/series/the-blood-knights-villains/' }),
        title: 'The Blood Knight’s Villains'
    },
    child: {
        id: '/series/the-blood-knights-villains/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 5_958_510,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());