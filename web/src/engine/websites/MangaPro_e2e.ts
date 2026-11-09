import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangapro',
        title: 'ProChan'
    },
    container: {
        url: 'https://prochan.net/series/manhua/399/awakening-sss-rank-skill-after-a-kiss',
        id: '/series/manhua/399/awakening-sss-rank-skill-after-a-kiss',
        title: 'Awakening SSS-Rank skill after a Kiss'
    },
    child: {
        id: '/series/manhua/399/awakening-sss-rank-skill-after-a-kiss/22222/91',
        title: 'Chapter 91',
    },
    entry: {
        index: 0,
        size: 298_990,
        type: 'image/avif'
    }
}).AssertWebsite();