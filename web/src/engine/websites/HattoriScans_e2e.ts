import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hattoriscans',
        title: 'Hattori Scans'
    },
    container: {
        url: 'https://hattoriscans.com/manga/vahsi-bati-murimi',
        id: 'vahsi-bati-murimi',
        title: 'Vahşi Batı Murimi'
    },
    child: {
        id: 'bolum-119',
        title: 'Bölüm 119'
    },
    entry: {
        index: 0,
        size: 638_112,
        type: 'image/webp'
    }
}).AssertWebsite();