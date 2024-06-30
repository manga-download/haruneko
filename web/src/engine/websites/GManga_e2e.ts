import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'gmanga',
        title: 'GManga'
    },
    container: {
        url: 'https://gmanga.site/manga/catastrophic-necromancer/',
        id: JSON.stringify({ post: '2358', slug: '/manga/catastrophic-necromancer/'}),
        title: 'Catastrophic Necromancer'
    },
    child: {
        id: '/manga/catastrophic-necromancer/catastrophic-necromancer-20/',
        title: '20'
    },
    entry: {
        index: 0,
        size: 956_241,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());