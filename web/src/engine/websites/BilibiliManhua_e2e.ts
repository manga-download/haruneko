import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'bilibilimanhua',
        title: '哔哩哔哩 漫画 (Bilibili Manhua)'
    },
    container: {
        url: 'https://manga.bilibili.com/detail/mc27414',
        id: '27414',
        title: '猫之茗',
        timeout: 20_000
    },
    child: {
        id: '378510',
        title: '01 - 猫娘茉莉的糟糕穿越',
        timeout: 20_000
    },
    entry: {
        index: 1,
        size: 791_415,
        type: 'image/png'
    }
}).AssertWebsite();