import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'milasub',
        title: 'Mila Sub'
    },
    container: {
        url: 'https://www.milascan.com/manga/i-didnt-lull-you-to-sleep/',
        id: JSON.stringify({ post: '3609', slug: '/manga/i-didnt-lull-you-to-sleep/'}),
        title: 'Bana Takıntı Yap Diye Seni Uyutmadım'
    },
    child: {
        id: '/manga/i-didnt-lull-you-to-sleep/21-bolum/',
        title: '21.Bölüm'
    },
    entry: {
        index: 2,
        size: 843_939,
        type: 'image/jpeg'
    }
}).AssertWebsite();