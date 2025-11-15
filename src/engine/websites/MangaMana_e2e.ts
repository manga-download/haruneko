import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangamana',
        title: 'Manga Mana'
    },
    container: {
        url: 'https://www.manga-mana.com/m/rebirth',
        id: '/m/rebirth',
        title: ':Rebirth'
    },
    child: {
        id: '/m/rebirth/22',
        title: 'Chapitre 22'
    },
    entry: {
        index: 0,
        size: 83_262,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();