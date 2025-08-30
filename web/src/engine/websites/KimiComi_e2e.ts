import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kimicomi',
        title: 'KimiComi'
    },
    container: {
        url: 'https://kimicomi.com/series/8d465f5d76117',
        id: '/series/8d465f5d76117',
        title: 'Ziggurat'
    },
    child: {
        id: '/episodes/6a80a48fefa39/',
        title: 'Relic:001'
    },
    entry: {
        index: 0,
        size: 1_469_910,
        type: 'image/png'
    }
}).AssertWebsite();