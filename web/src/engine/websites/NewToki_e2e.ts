import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'newtoki',
        title: 'NewToki'
    },
    container: {
        url: 'https://newtoki468.com/webtoon/35818629/신혼부부-특별전형',
        id: encodeURI('/webtoon/35818629/신혼부부-특별전형'),
        title: '신혼부부 특별전형'
    },
    child: {
        id: '/webtoon/44562998',
        title: '30화'
    },
    entry: {
        index: 0,
        size: 114_944,
        type: 'image/jpeg'
    }
}).AssertWebsite();