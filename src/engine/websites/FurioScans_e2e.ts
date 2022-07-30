import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'furioscans',
        title: 'Furio Scans'
    },
    container: {
        url: 'https://furioscans.com/manga/arcane-sniper/',
        id: JSON.stringify({ post: '2426', slug: '/manga/arcane-sniper/' }),
        title: 'Arcane Sniper'
    },
    child: {
        id: '/manga/arcane-sniper/capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 412_233,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());