import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hentainexus',
        title: 'HentaiNexus'
    },
    container: {
        url: 'https://hentainexus.com/view/19055',
        id: '/view/19055',
        title: 'Anemotion'
    },
    child: {
        id: '/read/19055',
        title: 'Anemotion'
    },
    entry: {
        index: 2,
        size: 1_523_714,
        type: 'image/png'
    }
}).AssertWebsite();