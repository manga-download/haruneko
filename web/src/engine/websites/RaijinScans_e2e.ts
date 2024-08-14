import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'raijinscans',
        title: 'RaijinScans'
    },
    container: {
        url: 'https://raijinscans.fr/manga/legendary-blacksmiths-vengeance/',
        id: JSON.stringify({post: '13549', slug: '/manga/legendary-blacksmiths-vengeance/' }),
        title: 'Legendary Blacksmith’s Vengeance'
    },
    child: {
        id: '/manga/legendary-blacksmiths-vengeance/chapitre-10/',
        title: 'Chapitre 10'
    },
    entry: {
        index: 1,
        size: 1_348_547,
        type: 'image/jpeg'
    }

};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());