import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mmfenix',
        title: 'MMFenix'
    },
    container: {
        url: 'https://mmdaos.com/manga/el-renacimiento-del-dios-supremo-del-fisico/',
        id: JSON.stringify({ post: '1863', slug: '/manga/el-renacimiento-del-dios-supremo-del-fisico/' }),
        title: 'El renacimiento del dios supremo del fisico'
    },
    child: {
        id: '/manga/el-renacimiento-del-dios-supremo-del-fisico/capitulo-500/',
        title: 'capitulo 500'
    },
    entry: {
        index: 0,
        size: 742_074,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();