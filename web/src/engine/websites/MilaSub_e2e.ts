import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'milasub',
        title: 'Mila Sub'
    },
    container: {
        url: 'https://www.milascan.com/manga/i-didnt-lull-you-to-sleep/',
        id: JSON.stringify({ post: '3609', slug: '/manga/i-didnt-lull-you-to-sleep/'}),
        title: 'I Didn’t Lull You To Sleep Only For You To Be Obsessed With Me'
    },
    child: {
        id: '/manga/i-didnt-lull-you-to-sleep/5-bolum/',
        title: '5..Bölüm'
    },
    entry: {
        index: 10,
        size: 2_094_015,
        type: 'image/jpeg'
    }
}).AssertWebsite();