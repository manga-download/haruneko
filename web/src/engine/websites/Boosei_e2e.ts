import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'boosei',
        title: 'Boosei'
    },
    // Geo-blocked (Region: Indonesia)
    /*
    container: {
        url: 'https://boosei.net/manga/gaishuu-isshoku/',
        id: '/manga/gaishuu-isshoku/',
        title: 'Gaishuu Isshoku'
    },
    child: {
        id: '/gaishuu-isshoku-chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 143_218,
        type: 'image/jpeg'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());