import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'sapphirescan',
        title: 'Sapphire Scan'
    },
    container: {
        url: 'https://sapphirescan.com/manga/el-yerno-mas-fuerte-de-la-historia/',
        id: JSON.stringify({ post: '1879', slug: '/manga/el-yerno-mas-fuerte-de-la-historia/' }),
        title: 'El yerno más fuerte de la historia.'
    },
    child: {
        id: '/manga/el-yerno-mas-fuerte-de-la-historia/capitulo-214/',
        title: 'Capítulo 214'
    },
    entry: {
        index: 7,
        size: 1_113_413,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();