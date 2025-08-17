import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comikey-archive',
        title: 'Comikey (Archive)'
    },
    container: {
        url: 'https://cdn.comikey-cloud.workers.dev/read/kengan-ashura-manga/',
        id: 'kengan-ashura-manga',
        title: 'Kengan Ashura'
    },
    child: {
        id: 'onlKWD/chapter-1',
        title: 'Chapter 1 - Asura'
    },
    entry: {
        index: 0,
        size: 1_219_237,
        type: 'image/jpeg'
    }
}).AssertWebsite();