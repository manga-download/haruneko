import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'welovemanga',
        title: 'WeloveManga'
    },
    container: {
        url: 'https://welovemanga.one/1067/',
        id: '/1067/',
        title: 'TONO KANRI O SHITE MIYOU',
        timeout: 15000
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
};

new TestFixture(config).AssertWebsite();