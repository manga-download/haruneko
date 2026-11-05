import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'okutoon',
        title: 'Okutoon',
    },
    container: {
        url: 'https://okutoon.com/the-crown-i-ll-claim',
        id: '/the-crown-i-ll-claim',
        title: `The Crown I'll Claim`
    },
    child: {
        id: '/the-crown-i-ll-claim/bolum-8',
        title: 'Bölüm 8'
    },
    entry: {
        index: 0,
        size: 208_532,
        type: 'image/webp'
    }
}).AssertWebsite();