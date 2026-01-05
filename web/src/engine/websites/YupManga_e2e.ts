import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yupmanga',
        title: 'YupManga',
    },
    container: {
        url: 'https://www.yupmanga.com/series.php?id=QHAVBVLSSSJ7H',
        id: '/series.php?id=QHAVBVLSSSJ7H',
        title: 'Deadman Wonderland'
    },
    /* Chapter have tokens
    child: {
        id: '/reader_v2.php?chapter=3F5D93FF85B347&token=XXXXXXXXXXXXXXX&page=1',
        title: 'Tomo - 01'
    },
    entry: {
        index: 4,
        size: 71_762,
        type: 'image/webp'
    }*/
}).AssertWebsite();