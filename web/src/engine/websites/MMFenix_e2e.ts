import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mmfenix',
        title: 'MMFenix'
    },
    container: {
        url: 'https://mmfenix.com/manga/el-renacimiento-del-dios-supremo-del-fisico/',
        id: JSON.stringify({ post: '1861', slug: '/manga/el-renacimiento-del-dios-supremo-del-fisico/' }),
        title: 'El Renacimiento Del Dios Supremo Del Físico'
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