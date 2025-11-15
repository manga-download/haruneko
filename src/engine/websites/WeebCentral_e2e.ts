import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
        id: '/chapters/01J76XZ8VTT3V8J44VAX442FRN',
        title: 'Chapter 545.5'
    },
    entry: {
        index: 0,
        size: 258_254,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();