import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
        index: 0,
        size: 39_019,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();