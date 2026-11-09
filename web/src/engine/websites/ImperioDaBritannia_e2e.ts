import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'imperiodabritania',
        title: 'Imperio Da Britannia'
    },
    container: {
        url: 'https://imperiodabritannia.net/manga/shinobigoto/',
        id: 'shinobigoto',
        title: 'Shinobigoto'
    },
    child: {
        id: '2254/71',
        title: 'Capítulo 71'
    },
    entry: {
        index: 1,
        size: 304_722,
        type: 'image/jpeg'
    }
}).AssertWebsite();