import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sapphirescan',
        title: 'Sapphire Scan'
    },
    container: {
        url: 'https://www.sapphirescan.com/2022/09/el-yerno-mas-fuerte-de-la-historia.html',
        id: '/2022/09/el-yerno-mas-fuerte-de-la-historia.html',
        title: 'El yerno más fuerte de la historia.'
    },
    child: {
        id: '/2022/11/capitulo-27.html',
        title: 'Capítulo 27'
    },
    entry: {
        index: 1,
        size: 103_231,
        type: 'image/jpeg'
    }
}).AssertWebsite();