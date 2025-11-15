import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comiczerosum',
        title: 'Comic ゼロサム (Comic ZEROSUM)'
    },
    container: {
        url: 'https://zerosumonline.com/detail/imoutoni',
        id: 'imoutoni',
        title: '妹に婚約者を取られたら、獣な王子に求婚されました～またたびとして溺愛されてます～'
    },
    child: {
        id: '284',
        title: '第1章'
    },
    entry: {
        index: 0,
        size: 212_514,
        type: 'image/webp'
    }
}).AssertWebsite();