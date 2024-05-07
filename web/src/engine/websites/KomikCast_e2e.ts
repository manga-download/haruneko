import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'komikcast',
        title: 'KomikCast'
    },
    container: {
        url: 'https://komikcast.ch/komik/swordmasters-youngest-son/',
        id: '/komik/swordmasters-youngest-son/',
        title: 'Swordmaster’s Youngest Son'
    },
    child: {
        id: '/chapter/swordmasters-youngest-son-chapter-01-bahasa-indonesia/',
        title: 'Chapter 01-fix'
    },
    entry: {
        index: 0,
        size: 1_133_808,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());