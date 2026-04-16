import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yupmanga',
        title: 'YupManga',
    },
    container: {
        url: 'https://www.yupmanga.com/series.php?id=0MHCAH4EG46B6',
        id: '/series.php?id=0MHCAH4EG46B6',
        title: 'Grey'
    },
    child: {
        id: '/reader_v2.php?chapter=0MHCAH4EM49W4',
        title: 'Tomo 09'
    },
    entry: {
        index: 0,
        size: 26_330,
        type: 'image/webp'
    }
}).AssertWebsite();