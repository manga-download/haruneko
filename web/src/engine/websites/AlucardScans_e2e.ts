import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'alucardscans',
        title: 'Alucard Scans'
    },
    container: {
        url: 'https://alucardscans.com/manga/zindan-efendisi',
        id: '6898c716a1e3d2910664d40c',
        title: 'Zindan Efendisi'
    },
    child: {
        id: '6898c80da1e3d2910664d4d4',
        title: 'Bölüm 92'
    },
    entry: {
        index: 0,
        size: 171_266,
        type: 'image/webp'
    }
}).AssertWebsite();