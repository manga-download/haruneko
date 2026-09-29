import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'newxtoon',
        title: 'NewXToon'
    },
    container: {
        url: 'https://newxtoon1.com/comics/12954',
        id: '/comics/12954',
        title: '흉가에 들어가면 안되는 이유'
    },
    child: {
        id: '/comics/12954/chapters/1063057',
        title: '99,공명'
    },
    entry: {
        index: 2,
        size: 57_208,
        type: 'image/webp'
    }
}).AssertWebsite();