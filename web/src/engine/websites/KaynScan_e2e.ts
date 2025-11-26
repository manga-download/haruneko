import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kaynscan',
        title: 'Kayn Scan'
    },
    container: {
        url: 'https://kaynscan.com/series/640e17f407b/',
        id: '/series/640e17f407b/',
        title: 'Jackpot After Divorce'
    },
    child: {
        id: '/chapter/640e17f407b-640e2360323/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 443_404,
        type: 'image/jpeg'
    }
}).AssertWebsite();