import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'digimon',
        title: 'Digimon'
    },
    container: {
        url: 'https://digimon.net/digimoncomic/en/#seekers',
        id: '/digimoncomic/en/#seekers',
        title: 'DIGIMON SEEKERS ～The Crossroad Witch～'
    },
    child: {
        id: '/digimoncomic/en/comic/seekers/ep_001/',
        title: 'ep.1'
    },
    entry: {
        index: 0,
        size: 335_303,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();