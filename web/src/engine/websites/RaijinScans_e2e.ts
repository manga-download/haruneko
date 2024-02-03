import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'raijinscans',
        title: 'RaijinScans'
    },
    /* CloudFlare
    container: {
        url: 'https://raijinscans.fr/manga/legendary-blacksmiths-vengeance/',
        id: JSON.stringify({post: '13579', slug: '/manga/legendary-blacksmiths-vengeance/' }),
        title: 'Legendary Blacksmith’s Vengeance'
    },
    child: {
        id: '/manga/legendary-blacksmiths-vengeance/chapitre-10/',
        title: 'Chapter 10'
    },
    entry: {
        index: 1,
        size: 1_348_547,
        type: 'image/png'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());