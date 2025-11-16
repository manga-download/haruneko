import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'welovemanga',
        title: 'WeloveManga'
    },
    container: {
        url: 'https://love4u.net/1067/',
        id: '/1067/',
        title: 'TONO KANRI O SHITE MIYOU - RAW',
    },
    child: {
        id: '/read-tono-kanri-o-shite-miyou-raw-chapter-65.2.html',
        title: 'Chapter 65.2',
    },
    entry: {
        index: 0,
        size: 219_948,
        type: 'image/jpeg'
    }
}).AssertWebsite();