import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ikigaimangas',
        title: 'Ikigai Mangas'
    },
    container: {
        url: 'https://visualikigai.skteq.xyz/series/el-sacerdote-sanador-del-sol/',
        id: '/series/el-sacerdote-sanador-del-sol/',
        title: 'El Sacerdote Sanador del Sol'
    },
    child: {
        id: '/capitulo/917826995654492162/',
        title: 'Capítulo 68'
    },
    entry: {
        index: 0,
        size: 689_586,
        type: 'image/webp'
    }
}).AssertWebsite();