import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'ainzscans',
        title: 'Ainzscans'
    },
    container: {
        url: 'https://ainzscans.net/series/disastrous-necromancer/',
        id: '/series/disastrous-necromancer/',
        title: 'Disastrous Necromancer'
    },
    child: {
        id: '/disastrous-necromancer-chapter-37-bahasa-indonesia/',
        title: 'Chapter 37'
    },
    entry: {
        index: 2,
        size: 995_872,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());