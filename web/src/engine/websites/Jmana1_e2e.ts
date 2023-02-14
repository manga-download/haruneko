import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'jmana1',
        title: '제이마나 (Jaymana)'
    },
    container: {
        url: `'https://kr14.jmana.one/comic_list_title?bookname=' + encodeURIComponent('저, 용사가 아니니까요.')`
        id: '/comic_list_title?bookname=%EC%A0%80%2C+%EC%9A%A9%EC%82%AC%EA%B0%80+%EC%95%84%EB%8B%88%EB%8B%88%EA%B9%8C%EC%9A%94.',
        title: '저, 용사가 아니니까요.'
    },
    child: {
        id: '/bookdetail?bookdetailid=571420',
        title: '1화'
    },
    entry: {
        index: 0,
        size: 265_318,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());
