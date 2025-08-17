import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Plain Images
new TestFixture({
    plugin: {
        id: 'colamanga',
        title: 'Coco漫画'
    },
    container: {
        url: 'https://www.colamanga.com/manga-rk63083/',
        id: '/manga-rk63083/',
        title: `王者大师兄(我就是不按套路出牌`
    },
    child: {
        id: '/manga-rk63083/1/54.html',
        title: '第54话 顾清欢'
    },
    entry: {
        index: 34,
        size: 126_960,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Encrypted Images
new TestFixture({
    plugin: {
        id: 'colamanga',
        title: 'Coco漫画'
    },
    container: {
        url: 'https://www.colamanga.com/manga-xy280343/',
        id: '/manga-xy280343/',
        title: `换位关系`
    },
    child: {
        id: '/manga-xy280343/1/10.html',
        title: '10.傻瓜'
    },
    entry: {
        index: 49,
        size: 29_211,
        type: 'image/jpeg'
    }
}).AssertWebsite();