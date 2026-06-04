import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kaynscan',
        title: 'Kayn Scan'
    },
    container: {
        url: 'https://kaynscan.org/series/jackpot-after-divorce',
        id: '84',
        title: 'Jackpot After Divorce'
    },
    child: {
        id: '/series/jackpot-after-divorce/chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 772_478,
        type: 'image/jpeg'
    }
}).AssertWebsite();