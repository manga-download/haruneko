import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'neoxscan',
        title: 'Neox Scanlator'
    },
    container: {
        url: 'https://nexoscans.net/manga/reencarna-6_2047_6-cao-maldita/',
        id: JSON.stringify({ post: '18652', slug: '/manga/reencarna-6_2047_6-cao-maldita/' }),
        title: 'Reencarnação Maldita'
    },
    child: {
        id: '/manga/reencarna-6_2047_6-cao-maldita/cap-81/',
        title: 'Cap. 81'
    },
    entry: {
        index: 1,
        size: 1_882_417,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());