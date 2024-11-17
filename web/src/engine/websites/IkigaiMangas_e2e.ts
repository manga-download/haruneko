import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ikigaimangas',
        title: 'Ikigai Mangas'
    },
    container: {
        url: 'https://visorikigai.ayotu.net/series/corrompi-al-sacerdote/',
        id: '/series/corrompi-al-sacerdote/',
        title: 'Corrompi al sacerdote'
    },
    child: {
        id: '/capitulo/977227421232791555/',
        title: 'Capítulo 27'
    },
    entry: {
        index: 0,
        size: 1_567_474,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();