import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'weebcentral',
        title: 'WeebCentral'
    },
    container: {
        url: 'https://weebcentral.com/series/01J76XY7E5E1C5Y9J0M2FCVQ8H/Fairy-Tail',
        id: '/series/01J76XY7E5E1C5Y9J0M2FCVQ8H/Fairy-Tail',
        title: 'Fairy Tail'
    },
    child: {
        id: '/chapters/01J76XYY77SY7EJ5AJ2S52JS2C',
        title: 'Chapter 545'
    },
    entry: {
        index: 0,
        size: 309_144,
        type: 'image/png'
    }
}).AssertWebsite();