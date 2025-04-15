import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kanman',
        title: '看漫画 (KanMan)'
    },
    container: {
        url: 'https://www.kanman.com/17745/',
        id: '17745',
        title: '凤逆天下'
    },
    child: {
        id: '1004',
        title: '第1话 神秘的黑玉1'
    },
    entry: {
        index: 3,
        size: 246_994,
        type: 'image/webp'
    }
}).AssertWebsite();