import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwaweb',
        title: 'ManhwaWeb'
    },
    container: {
        url: 'https://manhwaweb.com/manga/renacimientodelemperador_1719816094257',
        id: 'renacimientodelemperador_1719816094257',
        title: 'Renacimiento Del Emperador'
    },
    child: {
        id: 'renacimientodelemperador_1719816094257-1',
        title: '1'
    },
    entry: {
        index: 0,
        size: 832_901,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();