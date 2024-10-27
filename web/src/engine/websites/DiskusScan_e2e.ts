import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'diskusscan',
        title: 'Diskus Scan'
    },
    container: {
        url: 'https://diskusscan.online/manga/shenwu-tianzun/',
        id: '/manga/shenwu-tianzun/',
        title: 'Shenwu Tianzun'
    },
    child: {
        id: '/shenwu-tianzun-capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 90_802,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();