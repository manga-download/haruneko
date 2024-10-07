import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'arvenscans',
        title: 'Arven Scans'
    },
    container: {
        url: 'https://arvencomics.com/series/catastrophic-necromancer/',
        id: '/series/catastrophic-necromancer/',
        title: 'Catastrophic Necromancer'
    },
    child: {
        id: '/catastrophic-necromancer-chapter-15/',
        title: 'Chapter 15'
    },
    entry: {
        index: 0,
        size: 834_047,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());