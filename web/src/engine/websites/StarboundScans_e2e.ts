import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'starboundscans',
        title: 'Starbound Scans'
    },
    container: {
        url: 'https://starboundscans.com/series/17d7ee6e915/',
        id: '/series/17d7ee6e915/',
        title: `Academy's Genius Swordmaster`
    },
    child: {
        id: '/chapter/17d7ee6e915-25ba9849cab/',
        title: 'Chapitre 45'
    },
    entry: {
        index: 2,
        size: 1_653_851,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());