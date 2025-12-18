import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nemesisscans',
        title: 'Nemesis Scans'
    },
    container: {
        url: 'https://nemesisscans.com/manga/acimasiz-egitmen/',
        id: '/manga/acimasiz-egitmen/',
        title: 'Acımasız Eğitmen'
    },
    child: {
        id: '/acimasiz-egitmen-bolum-125/',
        title: 'Bölüm 125'
    },
    entry: {
        index: 0,
        size: 1_272_733,
        type: 'image/jpeg'
    }
}).AssertWebsite();