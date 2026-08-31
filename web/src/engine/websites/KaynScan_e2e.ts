import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kaynscan',
        title: 'Kayn Scan'
    },
    container: {
        url: 'https://kaynscans.com/series/comic/jackpot-after-divorce',
        id: '/series/comic/jackpot-after-divorce',
        title: 'Jackpot After Divorce'
    },
    child: {
        id: '/series/comic/jackpot-after-divorce/chapter/1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 566_008,
        type: 'image/jpeg'
    }
}).AssertWebsite();