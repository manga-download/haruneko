import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'newtoki',
        title: 'NewToki'
    },
    container: {
        url: 'https://newtoki469.com/webtoon/35818629/신혼부부-특별전형',
        id: encodeURI('/webtoon/35818629/신혼부부-특별전형'),
        title: '신혼부부 특별전형'
    },
    child: {
        id: encodeURI('/webtoon/44562998/신혼부부-특별전형-30화'),
        title: '30화'
    },
    entry: {
        index: 0,
        size: 114_944, // 131_338
        type: 'image/jpeg'
    }
}).AssertWebsite();