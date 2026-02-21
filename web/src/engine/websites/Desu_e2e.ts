import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'desu',
        title: 'Desu'
    }, /* Region Locked : Russia
    container: {
        url: 'https://desu.uno/manga/wondance.3628/',
        id: '/manga/wondance.3628/',
        title: 'WonDance'
    },
    child: {
        id: '/manga/wondance.3628/vol1/ch1/rus',
        title: 'Том 1. Глава 1 - Танец Ванды-сан'
    },
    entry: {
        index: 5,
        size: 146_711,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();